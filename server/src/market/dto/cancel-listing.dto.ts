import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CancelListingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;
}
