import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  otp: number;
}
