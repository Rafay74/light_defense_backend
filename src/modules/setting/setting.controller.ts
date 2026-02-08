import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { SettingService } from './setting.service';
import { CreateSupportDto } from './dto';
import { JwtGuard } from 'src/modules/auth/guards';

@Controller('setting')
@UseGuards(JwtGuard)
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllSupportRequest() {
    return await this.settingService.getAllSupportRequests();
  }

  @Post('help')
  @UseInterceptors(
    FileInterceptor('attachments', {
      storage: diskStorage({
        destination: './uploads/support-attachments',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `support-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
  async submitSupportRequest(
    @Body() data: CreateSupportDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const user_id = req.user.id;
    return await this.settingService.supportService(user_id, data, file);
  }
}
