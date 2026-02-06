import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRfqDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  company_name: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  part_number: string;

  @IsString()
  @MaxLength(255)
  model_number: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  manufacture_reference: string;
}
