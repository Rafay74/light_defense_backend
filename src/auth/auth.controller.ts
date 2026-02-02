import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDTO,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() data: RegisterDTO) {
    return this.authService.registerUser(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.loginUser(data);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return this.authService.logout();
  }

  //need to add after jwt module.
  //   @Get('me')
  //   @UseGuards(JwtAuthGuard)
  //   @HttpCode(HttpStatus.OK)
  //   async getCurrentUser(@Request() req) {
  //     return this.authService.getCurrentUser(req.user.id);
  //   }
}
