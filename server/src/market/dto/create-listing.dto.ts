import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IOrder } from "../interfaces/IOrder";

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
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userAddress: string;
}
