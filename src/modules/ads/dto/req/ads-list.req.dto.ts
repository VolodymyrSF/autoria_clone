import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class AdsListReqDto {
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsOptional()
  @IsString()
  make?: string;

  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Transform(TransformHelper.toNumber)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(TransformHelper.toNumber)
  maxPrice?: number;

  @IsOptional()
  image?: string[];

  @Transform(TransformHelper.trim)
  @IsOptional()
  @IsString()
  currency?: string;
}
