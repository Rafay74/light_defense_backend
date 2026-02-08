import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RfqService } from './rfq.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { JwtGuard } from 'src/modules/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('rfq')
@UseGuards(JwtGuard)
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getRfq(@Param('id') id: string) {
    return this.rfqService.getRfq(id);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllRfqs() {
    return this.rfqService.getAllRfqs();
  }

  @Post('/')
  @UseInterceptors(
    FileInterceptor('description_file', {
      storage: diskStorage({
        destination: './uploads/rfq-documents',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `rfq-${uniqueSuffix}${ext}`;
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
  async createRfq(
    @Body() data: CreateRfqDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const user_id = req.user.id;
    return this.rfqService.createRfq(user_id, data, file);
  }
}
