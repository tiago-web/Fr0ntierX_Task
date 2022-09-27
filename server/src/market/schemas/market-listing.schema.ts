import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

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

  @Prop()
  active: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const MarketListingSchema = SchemaFactory.createForClass(MarketListing);
