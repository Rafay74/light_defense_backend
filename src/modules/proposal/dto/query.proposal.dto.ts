import {
  IsOptional,
  IsString,
  IsDateString,
  Length,
  Matches,
} from 'class-validator';

import { PaginationDto } from '@utils/dto';
import { YYYY_MM_DD } from '@utils/regex';

export class QueryProposalDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  @Matches(YYYY_MM_DD, { message: 'invalid date format' })
  @Length(10, 10, { message: 'invalid date format' })
  from_date?: string;

  @IsOptional()
  @IsDateString()
  @Matches(YYYY_MM_DD, { message: 'invalid date format' })
  @Length(10, 10, { message: 'invalid date format' })
  to_date?: string;
}
