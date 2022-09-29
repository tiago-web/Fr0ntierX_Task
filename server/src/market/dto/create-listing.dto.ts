import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IOrder } from "../interfaces/IOrder";
import { ISignature } from "../interfaces/ISignature";

export class CreateListingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  order: IOrder;

  @ApiProperty()
  @IsNotEmpty()
  signature: ISignature;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userAddress: string;
}
