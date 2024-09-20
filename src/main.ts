import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  UniqueConstraintExceptionFilter,
} from './exceptionFilters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
    new UniqueConstraintExceptionFilter(),
  );
  app.setGlobalPrefix('api');
  await app.listen(5000);
}
bootstrap();
