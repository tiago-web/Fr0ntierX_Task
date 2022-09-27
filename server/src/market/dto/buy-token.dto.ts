import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class BuyTokenDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenId: number;
}
