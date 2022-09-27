import { Module } from "@nestjs/common";
import { MarketService } from "./market.service";
import { MarketController } from "./market.controller";

import { MongooseModule } from "@nestjs/mongoose";
import {
  MarketListing,
  MarketListingSchema,
} from "./schemas/market-listing.schema";
import { Log, LogSchema } from "./schemas/log.schema";
import {
  TradeHistory,
  TradeHistorySchema,
} from "./schemas/trade-history.schema";
import { Front, FrontSchema } from "./schemas/front.schema";
import { ChainModule } from "../chain/chain.module";

@Module({
  imports: [
    ChainModule,
    MongooseModule.forFeature([
      { name: MarketListing.name, schema: MarketListingSchema },
      { name: Log.name, schema: LogSchema },
      { name: TradeHistory.name, schema: TradeHistorySchema },
      { name: Front.name, schema: FrontSchema },
    ]),
  ],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
