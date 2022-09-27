import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { OrderApprovedEventObject } from "src/chain/typechain-types/contracts/WyvernExchange";

interface Order
  extends Omit<
    OrderApprovedEventObject,
    | "maximumFill"
    | "listingTime"
    | "expirationTime"
    | "salt"
    | "orderbookInclusionDesired"
    | "hash"
  > {
  maximumFill: number;
  listingTime: string;
  expirationTime: string;
  salt: string;
}

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
  order: Order;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;
}
