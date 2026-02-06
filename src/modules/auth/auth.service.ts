import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDTO,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto';

import { UserService } from 'src/modules/users/users.service';
import { OtpService } from 'src/modules/otp/otp.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OtpService,

    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async registerUser(data: RegisterDTO) {
    const { email, password, dateOfBirth } = data;

    const userExists = await this.userService.findUserByEmail(email);
    if (userExists) {
      throw new BadRequestException('User exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const dob = new Date(dateOfBirth);

    const newUser = await this.userService.createUser({
      ...data,
      password: hashedPassword,
      dateOfBirth: dob,
    });

    return newUser;
  }

  async loginUser(data: LoginDto) {
    const { email, password } = data;

    const userExists = await this.userService.findUserByEmail(email);
    if (!userExists) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, userExists?.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: userExists.id, email: userExists.email };
    const access_token = this.jwtService.sign(payload);

    return {
      email: userExists.email,
      access_token,
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;
    const userExists = await this.userService.findUserByEmail(email);
    if (!userExists) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //generate otp and send
    const otp = await this.otpService.generateOtp(email);
    return otp; //needs to send email for OTP.
  }

  async verifyOtp(data: VerifyOtpDto) {
    const { otp, email } = data;
    const results = await this.otpService.verifyOtp(email, otp);

    if (!results) {
      throw new UnauthorizedException('OTP verification failed.');
    }

    return true;
  }

  async resetPassword(data: ResetPasswordDto) {
    const { email, newPassword } = data;

    const userExists = await this.userService.findUserByEmail(email);
    if (!userExists) {
      throw new UnauthorizedException('User doesnt exist.');
    }

    await this.otpService.recentOtp(email);

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    return await this.userService.updatePassword(
      userExists.id,
      hashedNewPassword
    );
  }

  async getCurrentUser(user_id: string) {
    return await this.userService.findById(user_id);
  }

  async logout() {}
}
