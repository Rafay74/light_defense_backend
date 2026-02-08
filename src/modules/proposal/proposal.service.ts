import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  type Repository,
  type DeepPartial,
} from 'typeorm';

import { Proposal } from 'src/models';

import { QueryProposalDto, CreateProposalDto } from './dto';

import { PaginationSortEnum } from '@utils/enums';

import type { Proposal as ProposalType } from '@types';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>
  ) {}

  async getProposals(
    user_id: string,
    query: QueryProposalDto
  ): Promise<ProposalType[]> {
    return await this.proposalRepository.find({
      where: {
        user_id,
        ...(query.search && { number: ILike(`%${query.search}%`) }),
        ...(query.from_date && {
          due_date: MoreThanOrEqual(new Date(query.from_date)),
        }),
        ...(query.to_date && {
          due_date: LessThanOrEqual(new Date(query.to_date)),
        }),
      },
      skip: query.offset,
      take: query.limit,
      order: {
        createdAt: query.sort_by === PaginationSortEnum.ASC ? 'ASC' : 'DESC',
      },
      select: {
        id: true,
        number: true,
        due_date: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getProposal(user_id: string, id: string): Promise<ProposalType | null> {
    return await this.proposalRepository.findOne({
      where: { id },
      select: {
        id: true,
        number: true,
        due_date: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createProposal(
    user_id: string,
    data: CreateProposalDto,
    file: Express.Multer.File
  ): Promise<ProposalType & { user_id: string }> {
    if (!file || !file?.path) {
      throw new BadRequestException('File upload failed');
    }

    const proposal = this.proposalRepository.create({
      user: {
        id: user_id,
      },
      number: this.generateProposalNumber(),
      due_date: data?.due_date ? new Date(data.due_date) : null,
      content: {
        business: {
          uri: file.path,
        },
        ...data.content,
      },
    } as DeepPartial<Proposal>);

    return await this.proposalRepository.save(proposal);
  }

  private generateProposalNumber(): string {
    return `${new Date().getFullYear()}/${new Date().getMonth() + 1}${new Date().getDate()}${new Date().getTime()}`;
  }
}
