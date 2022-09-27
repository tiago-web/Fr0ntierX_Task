import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  authorAddress: string;

  @Prop({ required: true })
  tokenId: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  buyerAddress: string;

  @Prop({ required: true })
  sellerAddress: string;

  @Prop({ required: true })
  action: "CREATE_LISTING" | "EXECUTE_SELL" | "CANCEL_LISTING";

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
