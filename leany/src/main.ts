import { NestFactory } from '@nestjs/core';
import { MainModule } from './module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const openApiDocumentConfig = new DocumentBuilder()
    .setTitle('Tech Test Leany')
    .setDescription('Technical case study')
    .setVersion('1.0')
    .setContact(
      'Otávio Baziewicz Filho',
      'https://otavio.baziewi.cz',
      'otavio.baziewicz.filho@gmail.com'
    )
    .build();

  SwaggerModule.setup('api-spec', app, () =>
    SwaggerModule.createDocument(app, openApiDocumentConfig)
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port')!;
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error(err);
});
