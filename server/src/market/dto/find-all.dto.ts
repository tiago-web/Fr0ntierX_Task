import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class FindAllDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}
