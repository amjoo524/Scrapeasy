import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ScrapRateItemDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @IsPositive()
  rate_per_kg: number;
}

export class UpdateScrapRatesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScrapRateItemDto)
  rates: ScrapRateItemDto[];
}
