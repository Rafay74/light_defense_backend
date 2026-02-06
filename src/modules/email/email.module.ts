import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'SMTP_TRANSPORTER',
      useFactory: (configService: ConfigService) => {
        const smtpConfig = {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT', 587),
          secure: configService.get<boolean>('SMTP_SECURE', false),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        };

        if (
          !smtpConfig.host ||
          !smtpConfig.auth.user ||
          !smtpConfig.auth.pass
        ) {
          throw new Error(
            'SMTP configuration incomplete. Required: SMTP_HOST, SMTP_USER, SMTP_PASSWORD'
          );
        }

        return nodemailer.createTransport(smtpConfig);
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
