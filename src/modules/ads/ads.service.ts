import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as leoProfanity from 'leo-profanity';
import { Repository } from 'typeorm';

import { AdViewEntity } from '../../database/entities/ad-view.entity';
import { AdsEntity } from '../../database/entities/ads.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { CarBrandsService } from '../car-brand/car-brands.service';
import { CarModelsService } from '../car-model/car-models.service';
import { CurrencyService } from '../currency/currency.service';
import { ContentType } from '../file-storage/enums/content-type.enum';
import { FileStorageService } from '../file-storage/services/file-storage.service';
import { UserResDto } from '../users/models/dto/res/user.res.dto';
import { AdsListReqDto } from './dto/req/ads-list.req.dto';
import { CreateAdsReqDto } from './dto/req/create-ads.req.dto';
import { UpdateAdsReqDto } from './dto/req/update-ads.req.dto';
import { UploadImageReqDto } from './dto/req/upload-image.req.dto';
import { AdResDto } from './dto/res/ad.res.dto';
import { AdStatisticsResDto } from './dto/res/ad-statistics.res.dto';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(AdsEntity)
    @InjectRepository(AdsEntity)
    private adsRepository: Repository<AdsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AdViewEntity)
    private readonly adViewRepository: Repository<AdViewEntity>,
    private readonly carBrandsService: CarBrandsService,
    private readonly carModelsService: CarModelsService,
    private readonly currencyService: CurrencyService,
    private readonly mailerService: MailerService,
    private readonly fileStorageService: FileStorageService,
  ) {}
  // Створення оголошення
  async createAd(
    createAdsReqDto: CreateAdsReqDto,
    files: UploadImageReqDto[],
  ): Promise<AdResDto> {
    const userId = createAdsReqDto.userId;
    if (!userId) {
      throw new Error('User ID is required to create an ad');
    }
    const uploadedImages = await this.uploadImages(files, userId);

    leoProfanity.loadDictionary('en');
    const containsBadWords = leoProfanity.check(createAdsReqDto.description);

    if (containsBadWords) {
      throw new BadRequestException('Description has bad words.');
    }

    if (!userId) {
      throw new Error('User ID is required to create an ad');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['accountType', 'ads'],
    });

    if (user.accountType.name === 'Basic' && user.ads.length >= 1) {
      throw new BadRequestException('Basic account can only post one ad.');
    }

    if (!user) {
      throw new Error('User with ID ${userId} not found');
    }

    const brand = await this.carBrandsService.findBrandByName(
      createAdsReqDto.make,
    );
    if (!brand) {
      throw new NotFoundException('Brand ${createAdsReqDto.make} not found.');
    }

    const model = await this.carModelsService.findModelByNameAndBrand(
      createAdsReqDto.model,
      brand.name,
    );
    if (!model) {
      throw new NotFoundException(
        'Model ${createAdsReqDto.model} for brand ${createAdsReqDto.make} not found.,',
      );
    }

    const currencyRate = await this.currencyService.getCurrencyRate(
      createAdsReqDto.currency,
    );
    if (!currencyRate) {
      throw new Error(
        'Currency rate for ${createAdsReqDto.currency} not found',
      );
    }

    const priceInUAH = createAdsReqDto.price * currencyRate;

    const newAd = this.adsRepository.create({
      ...createAdsReqDto,
      user,
      price: priceInUAH,
      brand,
      model,
      image: uploadedImages,
      isCensored: containsBadWords,
      isApproved: !containsBadWords,
      status: containsBadWords ? 'pending' : 'active',
      revisionCount: 0,
    });

    const savedAd = await this.adsRepository.save(newAd);

    // Відповідь для користувача
    return {
      id: savedAd.id,
      make: savedAd.brand.name,
      model: savedAd.model.name,
      image: savedAd.image,
      region: savedAd.region,
      year: savedAd.year,
      price: savedAd.price,
      currency: 'UAH',
      description: savedAd.description,
      createdAt: savedAd.createdAt,
      updatedAt: savedAd.updatedAt,
      exchangeRate: currencyRate,
    };
  }

  private async uploadImages(
    files: UploadImageReqDto[],
    userId: string,
  ): Promise<string[]> {
    const uploadedImages: string[] = [];
    for (const file of files) {
      const imagePath = await this.fileStorageService.uploadFile(
        file.image,
        ContentType.IMAGE,
        userId,
      );
      uploadedImages.push(imagePath);
    }
    return uploadedImages;
  }

  // Оновлення оголошення
  async updateAd(
    id: string,
    updateAdsReqDto: UpdateAdsReqDto,
  ): Promise<AdResDto> {
    const ad = await this.adsRepository.findOne({
      where: { id },
      relations: ['brand', 'model'],
    });
    if (!ad) throw new NotFoundException('Ad not found');
    leoProfanity.loadDictionary('en');
    const containsBadWords = leoProfanity.check(updateAdsReqDto.description);

    if (containsBadWords) {
      throw new BadRequestException('Description has bad words.');
    }

    ad.description = updateAdsReqDto.description;
    ad.isCensored = containsBadWords;
    ad.isApproved = !containsBadWords;
    ad.status = containsBadWords ? 'pending' : 'active';
    ad.revisionCount += 1;

    if (ad.revisionCount > 3) {
      ad.status = 'inactive';
      ad.isApproved = false;

      const managers = await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.role', 'role')
        .where('role.name = :roleName', { roleName: 'manager' })
        .getMany();

      if (managers.length === 0) {
        console.warn('No admins found to notify about missing brand');
        return;
      }

      const managerEmails = managers.map((manager) => manager.email);

      try {
        await this.mailerService.sendMail({
          to: managerEmails,
          subject: `Ad #${ad.id} requires review`,
          template: 'ad-review',
          context: {
            adId: ad.id,
            description: ad.description,
            user: ad.user?.name || 'Unknown User',
            revisions: ad.revisionCount,
          },
        });

        console.log(`Manager notified about ad: ${ad.id}`);
      } catch (error) {
        console.error(`Failed to send email about ad: ${error.message}`);
      }
    }
    if (updateAdsReqDto.make) {
      const brand = await this.carBrandsService.findBrandByName(
        updateAdsReqDto.make,
      );
      if (!brand) {
        throw new NotFoundException(`Brand ${updateAdsReqDto.make} not found.`);
      }
      ad.brand = brand;
    }

    if (updateAdsReqDto.model) {
      const brand = ad.brand; // Отримуємо поточний бренд оголошення
      const model = await this.carModelsService.findModelByNameAndBrand(
        updateAdsReqDto.model,
        brand.id,
      );
      if (!model) {
        throw new NotFoundException(
          `Model ${updateAdsReqDto.model} for brand ${brand.name} not found.`,
        );
      }
      ad.model = model;
    }

    if (updateAdsReqDto.currency || updateAdsReqDto.price) {
      const currencyRate = await this.currencyService.getCurrencyRate(
        ad.currency,
      );
      const priceInUAH = updateAdsReqDto.price
        ? updateAdsReqDto.price * currencyRate
        : ad.price;
      ad.price = priceInUAH;
    }

    Object.assign(ad, updateAdsReqDto);
    const savedAd = await this.adsRepository.save(ad);

    return {
      id: savedAd.id,
      make: savedAd.brand.name,
      model: savedAd.model.name,
      year: savedAd.year,
      region: savedAd.region,
      price: savedAd.price,
      currency: savedAd.currency,
      description: savedAd.description,
      createdAt: savedAd.createdAt,
      updatedAt: savedAd.updatedAt,
    };
  }

  async deleteAd(adId: string, userId: string): Promise<string> {
    const ad = await this.adsRepository.findOne({
      where: { id: adId },
      relations: ['user'],
    });

    if (!ad) {
      throw new NotFoundException(`Ad with ID ${adId} not found.`);
    }

    if (ad.user.id !== userId) {
      throw new BadRequestException(
        'You do not have permission to delete this ad.',
      );
    }

    await this.adsRepository.remove(ad);

    return `Ad with ID ${adId} has been successfully deleted.`;
  }

  async listAllAds(): Promise<AdResDto[]> {
    const ads = await this.adsRepository.find({
      relations: ['brand', 'model'],
    });
    const convertedAds: AdResDto[] = [];

    for (const ad of ads) {
      const currencyRate = await this.currencyService.getCurrencyRate(
        ad.currency,
      );
      if (!currencyRate) {
        throw new Error(`Currency rate for ${ad.currency} not found`);
      }

      const priceInUAH = ad.price * currencyRate;

      convertedAds.push({
        id: ad.id,
        make: ad.brand.name,
        model: ad.model.name,
        year: ad.year,
        region: ad.region,
        price: priceInUAH,
        currency: 'UAH',
        description: ad.description,
        createdAt: ad.createdAt,
        updatedAt: ad.updatedAt,
        exchangeRate: currencyRate,
        image: ad.image,
      });
    }

    return convertedAds;
  }
  async listAds(adsListReqDto: AdsListReqDto): Promise<AdResDto[]> {
    const { make, model, minPrice, maxPrice, currency } = adsListReqDto;

    const queryBuilder = this.adsRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.brand', 'brand')
      .leftJoinAndSelect('ad.model', 'model');

    if (make) {
      queryBuilder.andWhere('brand.name = :make', { make });
    }

    if (model) {
      queryBuilder.andWhere('model.name = :model', { model });
    }

    if (minPrice) {
      queryBuilder.andWhere('ad.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('ad.price <= :maxPrice', { maxPrice });
    }

    if (currency) {
      queryBuilder.andWhere('ad.currency = :currency', { currency });
    }

    const ads = await queryBuilder.getMany();

    const convertedAds: AdResDto[] = [];

    let targetCurrencyRate = 1;
    if (currency) {
      const currencyRate = await this.currencyService.getCurrencyRate(currency);
      if (!currencyRate) {
        throw new Error(`Currency rate for ${currency} not found`);
      }
      targetCurrencyRate = currencyRate;
    }

    for (const ad of ads) {
      let priceInTargetCurrency = ad.price;
      if (ad.currency !== currency) {
        const adCurrencyRate = await this.currencyService.getCurrencyRate(
          ad.currency,
        );
        if (!adCurrencyRate) {
          throw new Error(`Currency rate for ${ad.currency} not found`);
        }
        priceInTargetCurrency =
          ad.price * (adCurrencyRate / targetCurrencyRate);
      }

      convertedAds.push({
        id: ad.id,
        make: ad.brand.name,
        model: ad.model.name,
        year: ad.year,
        region: ad.region,
        price: priceInTargetCurrency,
        currency: currency,
        description: ad.description,
        createdAt: ad.createdAt,
        image: ad.image,
        updatedAt: ad.updatedAt,
        exchangeRate: targetCurrencyRate,
      });
    }

    return convertedAds;
  }

  async getAdStatistics(
    adId: string,
    user: UserResDto,
  ): Promise<AdStatisticsResDto> {
    const ad = await this.adsRepository.findOne({
      where: { id: adId },
      relations: ['brand', 'model'],
    });

    if (!ad) {
      throw new Error('Ad not found');
    }

    const viewsCount = await this.getAdViews(adId);
    const dailyViewsCount = await this.getAdViews(adId, 'daily');
    const weeklyViewsCount = await this.getAdViews(adId, 'weekly');
    const monthlyViewsCount = await this.getAdViews(adId, 'monthly');

    const averagePriceByRegion = await this.calculateAveragePriceByRegion(
      ad.region,
      ad.brand.id,
      ad.model.id,
    );

    const averagePriceNationwide = await this.calculateAveragePriceNationwide(
      ad.brand.id,
      ad.model.id,
    );

    return {
      viewsCount,
      dailyViewsCount,
      weeklyViewsCount,
      monthlyViewsCount,
      averagePriceByRegion,
      averagePriceNationwide,
      currency: 'UAH',
    };
  }

  private async getAdViews(
    adId: string,
    period?: 'daily' | 'weekly' | 'monthly',
  ): Promise<number> {
    const queryBuilder = this.adViewRepository
      .createQueryBuilder('view')
      .where('view.adId = :adId', { adId });

    if (period === 'daily') {
      queryBuilder.andWhere("view.createdAt >= NOW() - INTERVAL '1 day'");
    } else if (period === 'weekly') {
      queryBuilder.andWhere("view.createdAt >= NOW() - INTERVAL '7 days'");
    } else if (period === 'monthly') {
      queryBuilder.andWhere("view.createdAt >= NOW() - INTERVAL '30 days'");
    }

    const result = await queryBuilder.getCount();
    return result;
  }

  private async calculateAveragePriceByRegion(
    region: string,
    brandId: string,
    modelId: string,
  ): Promise<number> {
    const queryBuilder = this.adsRepository
      .createQueryBuilder('ads')
      .select('AVG(ads.price)', 'averagePrice')
      .where('ads.region = :region', { region })
      .andWhere('ads.brand_id = :brandId', { brandId })
      .andWhere('ads.model_id = :modelId', { modelId })
      .andWhere('ads.status = :status', { status: 'active' });

    const result = await queryBuilder.getRawOne();
    return Number(result?.averagePrice) || 0;
  }

  private async calculateAveragePriceNationwide(
    brandId: string,
    modelId: string,
  ): Promise<number> {
    const queryBuilder = this.adsRepository
      .createQueryBuilder('ads')
      .select('AVG(ads.price)', 'averagePrice')
      .where('ads.brand_id = :brandId', { brandId })
      .andWhere('ads.model_id = :modelId', { modelId })
      .andWhere('ads.status = :status', { status: 'active' });

    const result = await queryBuilder.getRawOne();
    return Number(result?.averagePrice) || 0;
  }
}
