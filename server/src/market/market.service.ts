import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateListingDto } from "./dto/create-listing.dto";
import { CancelListingDto } from "./dto/cancel-listing.dto";
import { FindAllDto } from "./dto/find-all.dto";

import {
  MarketListing,
  MarketListingDocument,
} from "./schemas/market-listing.schema";
import { Log, LogDocument } from "./schemas/log.schema";
import {
  TradeHistory,
  TradeHistoryDocument,
} from "./schemas/trade-history.schema";
import { Front, FrontDocument } from "./schemas/front.schema";

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(MarketListing.name)
    private marketListingModel: Model<MarketListingDocument>,
    @InjectModel(Log.name)
    private logModel: Model<LogDocument>,
    @InjectModel(TradeHistory.name)
    private tradeHistoryModel: Model<TradeHistoryDocument>,
    @InjectModel(Front.name)
    private frontModel: Model<FrontDocument>, // private readonly chainService: ChainService,
  ) {
    // this.chainService.ethersProvider
    //   .getBlockNumber()
    //   .then((startBlockNumber) => {
    //     this.watchFrontTransferEvent(startBlockNumber);
    //   })
    //   .catch((err) => {
    //     console.error(err.message);
    //     throw new Error("Error while running marketplace listeners");
    //   });
  }

  watchFrontTransferEvent(startBlockNumber: number) {
    console.info("watching front NFTs tranfer events...");

    // this.chainService.elementNftsContract.on(
    //   "Transfer",
    //   async (from, to, tokenId, _event) => {
    //     if (_event.blockNumber <= startBlockNumber) return;

    //     console.info(
    //       `-- Transfer - tokenId ${tokenId}, from ${from}, to ${to}`,
    //     );
    //   },
    // );
  }

  async createListing(createListingDto: CreateListingDto) {
    // todo
  }

  async findAll(findAllDto: FindAllDto) {
    // todo
  }

  async cancelListing(cancelListingDto: CancelListingDto) {
    // todo
  }
}
