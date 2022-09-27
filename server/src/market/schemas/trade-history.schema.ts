import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TradeHistoryDocument = TradeHistory & Document;

@Schema({ timestamps: true })
export class TradeHistory {
  @Prop({ required: true })
  tokenId: number;

  @Prop({ required: true })
  buyerAddress: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TradeHistorySchema = SchemaFactory.createForClass(TradeHistory);
