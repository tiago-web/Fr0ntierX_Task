import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { MarketListing } from "./market-listing.schema";

export type TradeHistoryDocument = TradeHistory & Document;

@Schema({ timestamps: true })
export class TradeHistory {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "MarketListing",
  })
  listing: MarketListing;

  @Prop({ required: true })
  buyerAddress: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TradeHistorySchema = SchemaFactory.createForClass(TradeHistory);
