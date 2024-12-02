import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { SwaggerHelper } from './common/helpers/swagger.helpers';
import { AppConfig } from './configs/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  const config = new DocumentBuilder()
    .setTitle('autoria_clone')
    .setDescription('The autoria_clone description')
    .setVersion('1.0')
    .addBearerAuth({
      in: 'header',
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: false,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerHelper.setDefaultResponses(document);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: -1,
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  await app.listen(appConfig.port, () => {
    console.log(
      `Server is running on http://${appConfig.host}:${appConfig.port}`,
    );
    console.log(
      `Swagger is running on http://${appConfig.host}:${appConfig.port}/docs`,
    );
  });
}
void bootstrap();
