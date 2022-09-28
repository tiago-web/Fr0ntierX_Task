import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CancelListingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userAddress: string;
}
