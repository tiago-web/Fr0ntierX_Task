import { Module } from "@nestjs/common";
import { MarketService } from "./market.service";
import { MarketController } from "./market.controller";

import { MongooseModule } from "@nestjs/mongoose";
import {
  MarketListing,
  MarketListingSchema,
} from "./schemas/market-listing.schema";

import { User, UserSchema } from "./schemas/user.schema";
import { ChainModule } from "../chain/chain.module";

@Module({
  imports: [
    ChainModule,
    MongooseModule.forFeature([
      { name: MarketListing.name, schema: MarketListingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
