import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from 'src/models';
import { OtpService } from './otp.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Otp]), UsersModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
