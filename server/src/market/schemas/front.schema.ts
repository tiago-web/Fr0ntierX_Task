import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FrontDocument = Front & Document;

@Schema({ timestamps: true })
export class Front {
  @Prop({ required: true })
  tokenId: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const FrontSchema = SchemaFactory.createForClass(Front);
