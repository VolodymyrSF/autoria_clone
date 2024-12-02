import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';

import { CarBrandEntity } from '../../database/entities/car-brand.entity';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class CarBrandsService {
  private readonly logger = new Logger(CarBrandsService.name);

  constructor(
    @InjectRepository(CarBrandEntity)
    private readonly carBrandRepository: Repository<CarBrandEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async findAllBrands(): Promise<CarBrandEntity[]> {
    return await this.carBrandRepository.find();
  }

  async createBrand(name: string): Promise<CarBrandEntity> {
    const newBrand = this.carBrandRepository.create({ name });
    return await this.carBrandRepository.save(newBrand);
  }

  async notifyMissingBrand(brandName: string): Promise<void> {
    const admins = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .where('role.name = :roleName', { roleName: 'admin' })
      .getMany();

    if (admins.length === 0) {
      this.logger.warn('No admins found to notify about missing brand');
      return;
    }

    const adminEmails = admins.map((admin) => admin.email);

    const templatePath = path.join(
      process.cwd(),
      'dist',
      'templates',
      'missing-brand.hbs',
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
        subject: 'Missing Car Brand Notification',
        template: 'missing-brand',
        context: { brandName },
        from: process.env.FROM_EMAIL,
      });

      this.logger.log(`Admins notified about missing brand: ${brandName}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email about missing brand: ${error.message}`,
        error.stack,
      );
    }
  }

  async findBrandByName(name: string): Promise<CarBrandEntity | undefined> {
    return await this.carBrandRepository.findOne({ where: { name } });
  }
}
