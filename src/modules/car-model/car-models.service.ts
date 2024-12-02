import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import fs from 'fs';
import path from 'path';
import { Repository } from 'typeorm';

import { CarBrandEntity } from '../../database/entities/car-brand.entity';
import { CarModelEntity } from '../../database/entities/car-model.entity';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class CarModelsService {
  private readonly logger = new Logger(CarModelsService.name);

  constructor(
    @InjectRepository(CarModelEntity)
    private readonly carModelRepository: Repository<CarModelEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async findModelsByBrand(brandName: string): Promise<CarModelEntity[]> {
    return await this.carModelRepository.find({
      where: { brand: { name: brandName } },
      relations: ['brand'],
    });
  }

  async createModel(name: string, brandName: string): Promise<CarModelEntity> {
    const brand = await this.carModelRepository.manager
      .getRepository(CarBrandEntity)
      .findOne({ where: { name: brandName } });

    if (!brand) {
      this.logger.error(`Brand with name "${brandName}" not found`);
      throw new Error(`Brand with name "${brandName}" not found`);
    }

    const newModel = this.carModelRepository.create({
      name,
      brand,
    });

    return await this.carModelRepository.save(newModel);
  }

  async notifyMissingModel(modelName: string, brandId: string): Promise<void> {
    const admins = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .where('role.name = :roleName', { roleName: 'admin' })
      .getMany();

    if (admins.length === 0) {
      this.logger.warn('No admins found to notify about missing model');
      return;
    }

    const adminEmails = admins.map((admin) => admin.email);

    const templatePath = path.join(
      process.cwd(),
      'dist',
      'templates',
      'missing-model.hbs',
    );
    this.logger.debug(`Checking template path: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
      this.logger.error(`Template not found: ${templatePath}`);
      return;
    }
    this.logger.debug(`Template is available at: ${templatePath}`);

    try {
      await this.mailerService.sendMail({
        to: adminEmails,
        subject: 'Missing Car Model Notification',
        template: 'missing-model',
        context: { modelName, brandId },
        from: process.env.FROM_EMAIL,
      });

      this.logger.log(
        `Admins notified about missing model: ${modelName} for brand ${brandId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email about missing model: ${error.message}`,
        error.stack,
      );
    }
  }

  async findModelByNameAndBrand(
    name: string,
    brandName: string,
  ): Promise<CarModelEntity | undefined> {
    return await this.carModelRepository.findOne({
      where: {
        name,
        brand: { name: brandName },
      },
      relations: ['brand'],
    });
  }
}
