import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Arch-Ref')
    .setDescription('The Arch-Ref API reference to new projects')
    .setVersion('1.0')
    .addTag('arch-ref')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(3000);
}
bootstrap();
