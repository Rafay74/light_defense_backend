import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import * as nodemailer from 'nodemailer';
import { emailTemplateForOTP } from 'src/modules/otp/templates';

interface IEmail {
  email: string;
  code: number;
}

@Injectable()
export class EmailService {
  constructor(
    @Inject('SMTP_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
    private readonly configService: ConfigService
  ) {}

  @OnEvent('OTP_GENERATED')
  async sendEmail(payload: IEmail) {
    try {
      const { email, code } = payload;

      if (!email || !code) {
        console.warn('EmailService: Missing email or code');
        return;
      }

      const mailOptions = {
        from: this.configService.get(
          'SMTP_FROM',
          this.configService.get('SMTP_USER')
        ),
        to: email,
        subject: 'Your OTP Code',
        html: emailTemplateForOTP(code),
      };

      await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully to:', email);
    } catch (error) {
      console.error('EmailService: Failed to send OTP email', {
        error: error.message,
        email: payload?.email,
      });
    }
  }
}
