import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BilledDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  gst: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class ContentDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BilledDto)
  billed: BilledDto;
}

export class CreateProposalDto {
  @IsOptional()
  @IsString()
  due_date: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContentDto)
  content: ContentDto;
}
