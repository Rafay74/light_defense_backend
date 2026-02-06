import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupportDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
