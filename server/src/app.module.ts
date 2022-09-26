import { Module } from "@nestjs/common";
import * as Joi from "@hapi/joi";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import configuration from "./config/configuration";
import { MONGODB_DATABASE, DB_NAME } from "./config/constants";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MarketModule } from "./market/market.module";

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_DATABASE, {
      dbName: DB_NAME,
      retryWrites: true,
    }),
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision")
          .default("development"),
        PORT: Joi.number().default(3001),
        RPC_URL: Joi.string().required(),
        DEPLOYER_MNEMONIC: Joi.string(),
        DEPLOYER_PRIVATE_KEY: Joi.string(),
      }),
    }),
    MarketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
