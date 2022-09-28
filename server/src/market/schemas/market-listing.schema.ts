import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";
import { IOrder } from "../interfaces/IOrder";

export type MarketListingDocument = MarketListing & Document;

@Schema({ timestamps: true })
export class MarketListing {
  @Prop({ required: true })
  @ApiProperty()
  tokenId: number;

  @Prop({ required: true })
  @ApiProperty()
  sellerAddress: string;

  @Prop({ required: true })
  @ApiProperty()
  price: number;

  @Prop(
    raw({
      registry: { type: String },
      maker: { type: String },
      staticTarget: { type: String },
      staticSelector: { type: String },
      staticExtradata: { type: String },
      maximumFill: { type: Number },
      listingTime: { type: String },
      expirationTime: { type: String },
      salt: { type: String },
    }),
  )
  order: IOrder;

  @Prop()
  active: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const MarketListingSchema = SchemaFactory.createForClass(MarketListing);
