import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { MarketListing } from "./market-listing.schema";

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "MarketListing",
  })
  listing: MarketListing;

  @Prop({ required: true })
  authorAddress: string;

  @Prop(
    raw({
      tokenId: { type: Number },
      price: { type: Number },
      buyerAddress: { type: String },
      sellerAddress: { type: String },
      expirationDate: { type: Date },
    }),
  )
  yamlBody: Record<string, any>;

  @Prop({ required: true })
  signatureHash: string;

  @Prop({ required: true })
  action: "CREATE_LISTING" | "EXECUTE_SELL" | "CANCEL_LISTING";

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
