import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from 'src/models';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  private generateOTPCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async findOtpAndInvalidate(user) {
    await this.otpRepository.update(
      { userId: user?.id, email: user?.email, used: false },
      { used: true }
    );
  }

  async generateOtp(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('OTP cannot be created without user.');
    }

    await this.findOtpAndInvalidate(user);
    const code = this.generateOTPCode();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const results = this.otpRepository.create({
      userId: user?.id,
      email,
      code,
      expiresAt,
      used: false,
    });

    const otp = await this.otpRepository.save(results);

    //emit event
    this.eventEmitter.emit('OTP_GENERATED', {
      email,
      code,
    });

    return otp;
  }

  async verifyOtp(email: string, otp_code: number) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User doesnt exist.');
    }

    const otp = await this.otpRepository.findOne({
      where: {
        userId: user.id,
        email,
        code: otp_code,
        used: false,
      },
    });

    if (!otp) {
      throw new UnauthorizedException('OTP doesnt exist.');
    }

    if (otp.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired, please request a new OTP.');
    }

    await this.otpRepository.update(otp.id, { used: true });
    return true;
  }

  async recentOtp(email: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User doesnt exist.');
    }

    const recentOtp = await this.otpRepository.findOne({
      where: {
        userId: user?.id,
        email: user?.email,
        used: true,
      },
      order: { updatedAt: 'DESC' },
    });

    if (!recentOtp) {
      throw new UnauthorizedException('Please verify OTP first.');
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (recentOtp.updatedAt < fifteenMinutesAgo) {
      throw new UnauthorizedException(
        'OTP verification expired. Please request a new OTP.'
      );
    }

    return recentOtp;
  }
}
