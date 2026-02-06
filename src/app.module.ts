import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Otp, Rfq, Support } from './models';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './modules/email/email.module';
import { OtpModule } from './modules/otp/otp.module';
import { RfqModule } from './rfq/rfq.module';
import { SettingModule } from './setting/setting.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Otp, Rfq, Support],
          synchronize:
            configService.get('NODE_ENV') === 'development' ? true : false,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    EmailModule,
    OtpModule,
    RfqModule,
    SettingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
