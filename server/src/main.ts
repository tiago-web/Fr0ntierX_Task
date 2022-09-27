// import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // use this pipe to validate http requests app wide
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // );

  // API Docs Set Up
  const apiDocsConfig = new DocumentBuilder()
    .setTitle("Fr0ntierX Test Task API")
    .setDescription("Fr0ntierX Test Task API")
    .setVersion("1.0")
    .addTag("fr0ntierx")
    .build();

  const apiDocs = SwaggerModule.createDocument(app, apiDocsConfig);
  SwaggerModule.setup("api", app, apiDocs, {
    swaggerOptions: {
      operationsSorter: "alpha",
      tagsSorter: "alpha",
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
