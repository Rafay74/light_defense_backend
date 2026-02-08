import {
  Controller,
  Body,
  Get,
  Param,
  Post,
  Req,
  Query,
  BadRequestException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

import { ProposalService } from './proposal.service';
import { QueryProposalDto, CreateProposalDto } from './dto';

import type { ResponseData, Proposal as ProposalType } from '@types';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get()
  async getProposals(
    @Req() req: Request,
    @Query() query: QueryProposalDto
  ): Promise<ResponseData<ProposalType[]>> {
    // const user = req?.user?.id as string;

    const data = await this.proposalService.getProposals('user_id', query);

    return {
      message: 'Proposals fetched successfully',
      data,
    };
  }

  @Get(':id')
  async getProposal(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<ResponseData<ProposalType | null>> {
    // const user_id = req?.user?.id as string;

    const data = await this.proposalService.getProposal('user_id', id);

    if (!data) {
      throw new NotFoundException('Proposal not found');
    }

    return {
      message: 'Proposal fetched successfully',
      data: data,
    };
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('description_file', {
      storage: diskStorage({
        destination: './uploads/business-logo',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `buisness-logo-${randomUUID()}${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/jpg',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only PDF, DOC, and DOCX are allowed.'
            ),
            false
          );
        }
      },
    })
  )
  @HttpCode(HttpStatus.CREATED)
  async createProposal(
    @Req() req: Request,
    @Body() body: CreateProposalDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseData<ProposalType>> {
    // const user_id = req?.user?.id as string;

    const data = await this.proposalService.createProposal(
      'user_id',
      body,
      file
    );

    const { user_id: _removed, ...dataForResponse } = data as ProposalType & {
      user_id?: string;
    };

    return {
      message: 'Proposal created successfully',
      data: dataForResponse,
    };
  }
}
