import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRespository.findOne({
      where: { email: email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRespository.findOne({ where: { id } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRespository.create(data);
    const results = this.userRespository.save(user);
    return results;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await this.userRespository.update(id, data);
    return this.findById(id);
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.userRespository.update(id, {
      password: newPassword,
    });
  }
}
