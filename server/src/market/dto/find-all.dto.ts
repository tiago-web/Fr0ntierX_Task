import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class FindAllDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  page?: number;
}
