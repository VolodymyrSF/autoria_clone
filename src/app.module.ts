import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';
import { TemplateLoaderService } from 'template-loader.service';

import configuration from './configs/configuration';
import { AccountTypesModule } from './modules/accounts/account-types.module';
import { AdsModule } from './modules/ads/ads.module';
import { AuthModule } from './modules/auth/auth.module';
import { CarBrandsModule } from './modules/car-brand/car-brands.module';
import { CarModelsModule } from './modules/car-model/car-models.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { RedisModule } from './modules/redis/redis.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mailer.smtp_host'),
          port: configService.get<number>('mailer.smtp_port'),
          auth: {
            user: configService.get<string>('mailer.smtp_email'),
            pass: configService.get<string>('mailer.smtp_password'),
          },
        },
        defaults: {
          from: configService.get<string>('mailer.from_email'),
        },
        template: {
          dir: path.join(process.cwd(), 'dist', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    AuthModule,
    CarModelsModule,
    CarBrandsModule,
    CurrencyModule,
    RepositoryModule,
    PostgresModule,
    RedisModule,
    UsersModule,
    AdsModule,
    RolesModule,
    AccountTypesModule,
    PermissionsModule,
  ],
  providers: [TemplateLoaderService], // Додаємо сервіс
})
export class AppModule {}
