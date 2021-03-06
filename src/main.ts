//only app.module

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const allowlist = [`http://localhost:3000`]; //front-end port number

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: allowlist,
    credentials: true, // response header add
  });
  //we can realize it's full utility by setting it up as a global-scoped pipe so that it is applied to every route handler across the entire application.
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000); // back-end port nunmber
}
bootstrap();
