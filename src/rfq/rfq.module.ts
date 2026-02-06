import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rfq } from 'src/models';
import { RfqController } from './rfq.controller';
import { RfqService } from './rfq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rfq])],
  controllers: [RfqController],
  providers: [RfqService],
  exports: [RfqService],
})
export class RfqModule {}
