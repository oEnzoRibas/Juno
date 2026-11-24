import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function start(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder().setTitle('Juno API').setVersion('0.1').build();
  SwaggerModule.setup('api/docs', app, () => SwaggerModule.createDocument(app, config), {
    ui: false,
    jsonDocumentUrl: '/api/openapi.json',
  });
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 3001), '0.0.0.0');
}

void start();
