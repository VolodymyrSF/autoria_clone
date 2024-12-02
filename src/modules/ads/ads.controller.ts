import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CarBrandsService } from '../car-brand/car-brands.service';
import { CarBrandDto } from '../car-brand/dto/car-brand.dto';
import { CarModelsService } from '../car-model/car-models.service';
import { CarModelDto } from '../car-model/dto/car-model.dto';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { AccountTypeGuard } from '../permissions/guards/account-type.guard';
import { JwtAccessGuard } from '../permissions/guards/jwt-access.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { UserResDto } from '../users/models/dto/res/user.res.dto';
import { AdsService } from './ads.service';
import { AdsListReqDto } from './dto/req/ads-list.req.dto';
import { CreateAdsReqDto } from './dto/req/create-ads.req.dto';
import { UpdateAdsReqDto } from './dto/req/update-ads.req.dto';
import { AdResDto } from './dto/res/ad.res.dto';
import { AdStatisticsResDto } from './dto/res/ad-statistics.res.dto';

@ApiTags('Ads')
@Controller('ads')
@ApiBearerAuth()
export class AdsController {
  constructor(
    private readonly adsService: AdsService,
    private readonly carBrandsService: CarBrandsService,
    private readonly carModelsService: CarModelsService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('create_ad')
  @Post()
  @UseInterceptors(FilesInterceptor('image', 5))
  @ApiOperation({ summary: 'Create a new ad' })
  @ApiResponse({
    status: 201,
    description: 'The ad has been successfully created.',
    type: AdResDto,
  })
  @ApiBody({ type: CreateAdsReqDto })
  async createAd(
    @Body() createAdsReqDto: CreateAdsReqDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() request,
  ): Promise<AdResDto> {
    const userId = request.res.locals.user.userId;
    if (!userId) {
      throw new Error(
        'User information is required to create an ad(in controller)',
      );
    }
    createAdsReqDto.userId = userId;

    const uploadImageReqDtos = files.map((file) => ({
      image: file,
    }));

    return await this.adsService.createAd(createAdsReqDto, uploadImageReqDtos);
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('edit_ad')
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing ad by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the ad to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The ad has been successfully updated.',
    type: AdResDto,
  })
  @ApiBody({ type: UpdateAdsReqDto })
  async updateAd(
    @Param('id') id: string,
    @Body() updateAdsReqDto: UpdateAdsReqDto,
  ): Promise<AdResDto> {
    return await this.adsService.updateAd(id, updateAdsReqDto);
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('view_ad')
  @Get('all')
  @ApiOperation({ summary: 'Get all ads' })
  @ApiResponse({
    status: 200,
    description: 'List of all ads.',
    type: [AdResDto],
  })
  async listAllAds(): Promise<AdResDto[]> {
    return await this.adsService.listAllAds();
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('delete_ad')
  @ApiOperation({ summary: 'Delete ad' })
  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  async deleteAd(@Param('id') adId: string, @Req() req): Promise<string> {
    const userId = req.user.id;
    return await this.adsService.deleteAd(adId, userId);
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('view_ad')
  @Get()
  @ApiOperation({ summary: 'Get a list of ads based on filter criteria' })
  @ApiQuery({
    name: 'make',
    required: false,
    description: 'Filter by car make',
    type: String,
  })
  @ApiQuery({
    name: 'model',
    required: false,
    description: 'Filter by car model',
    type: String,
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Filter by minimum price',
    type: Number,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Filter by maximum price',
    type: Number,
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    description: 'Filter by currency price',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of ads matching the filter criteria.',
    type: [AdResDto],
  })
  async listAds(@Query() adsListReqDto: AdsListReqDto): Promise<AdResDto[]> {
    return await this.adsService.listAds(adsListReqDto);
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('notify_missing')
  @Post('notify-missing-brand')
  @ApiOperation({ summary: 'Notify administration about a missing car brand' })
  @ApiResponse({
    status: 200,
    description: 'The missing brand has been successfully notified.',
  })
  async notifyMissingBrand(@Body() createBrandDto: CarBrandDto) {
    const brand = await this.carBrandsService.findBrandByName(
      createBrandDto.name,
    );
    if (brand) {
      throw new NotFoundException(
        `Brand "${createBrandDto.name}" already exists.`,
      );
    }
    await this.carBrandsService.notifyMissingBrand(createBrandDto.name);
    return {
      message: `Brand ${createBrandDto.name} has been notified as missing.`,
    };
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('notify_missing')
  @Post('notify-missing-model')
  @ApiOperation({ summary: 'Notify administration about a missing car model' })
  @ApiResponse({
    status: 200,
    description: 'The missing model has been successfully notified.',
  })
  async notifyMissingModel(@Body() carModelDto: CarModelDto) {
    const model = await this.carModelsService.findModelByNameAndBrand(
      carModelDto.name,
      carModelDto.brandName,
    );

    if (model) {
      throw new NotFoundException(
        `Model "${carModelDto.name}" already exists for brand "${carModelDto.brandName}".`,
      );
    }

    await this.carModelsService.notifyMissingModel(
      carModelDto.name,
      carModelDto.brandName,
    );
    return {
      message: `Model ${carModelDto.name} has been notified as missing for brand "${carModelDto.brandName}".`,
    };
  }

  @Get(':id/statistics')
  @UseGuards(JwtAccessGuard, AccountTypeGuard, AccountTypeGuard)
  @Permissions('view_ad_statistics', 'view_price_statistics')
  @ApiOperation({ summary: 'Get statistics for a specific ad' })
  @ApiResponse({
    status: 200,
    description: 'Statistics for the ad.',
    type: AdStatisticsResDto,
  })
  async getAdStatistics(
    @Param('id') adId: string,
    @Request() req: any,
  ): Promise<AdStatisticsResDto> {
    const user: UserResDto = req.user;
    return await this.adsService.getAdStatistics(adId, user);
  }
}
