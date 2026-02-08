import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Support } from 'src/models';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Support])],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [],
})
export class SettingModule {}
