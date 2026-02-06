import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Support } from 'src/models';
import { Repository } from 'typeorm';
import { CreateSupportDto } from './dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Support)
    private readonly supportRepository: Repository<Support>,
  ) {}

  async getAllSupportRequests() {
    return await this.supportRepository.find();
  }

  async supportService(
    user_id: string,
    data: CreateSupportDto,
    file: Express.Multer.File,
  ) {
    const support = this.supportRepository.create({
      ...data,
      user_id,
      attachments: file?.path,
    });

    return await this.supportRepository.save(support);
  }
}
