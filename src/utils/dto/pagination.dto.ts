import { IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

import { Type } from 'class-transformer';

import { PaginationSortEnum } from '../enums';

export class PaginationDto {
  @IsNumber()
  @Min(1, { message: 'must be a positive number' })
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @Min(0, { message: 'must be a non-negative number' })
  @Type(() => Number)
  offset: number;

  @IsOptional()
  @IsEnum(PaginationSortEnum)
  sort_by?: PaginationSortEnum;
}
