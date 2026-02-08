import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rfq } from 'src/models';
import { Repository } from 'typeorm';
import { CreateRfqDto } from './dto/create-rfq.dto';

@Injectable()
export class RfqService {
  constructor(
    @InjectRepository(Rfq)
    private readonly rfqRepository: Repository<Rfq>
  ) {}

  async getRfq(id: string): Promise<Rfq> {
    const rfq = await this.rfqRepository.findOne({ where: { id } });
    if (!rfq) {
      throw new NotFoundException('Rfq doesnt exists.');
    }
    return rfq;
  }

  async getAllRfqs() {
    const allRfqs = await this.rfqRepository.find();
    return allRfqs;
  }

  async createRfq(
    user_id: string,
    data: CreateRfqDto,
    file: Express.Multer.File
  ) {
    if (!file || !file.path) {
      throw new BadRequestException('File upload failed');
    }

    const rfq = this.rfqRepository.create({
      ...data,
      user_id,
      description_file_path: file?.path,
    });

    return await this.rfqRepository.save(rfq);
  }
}
