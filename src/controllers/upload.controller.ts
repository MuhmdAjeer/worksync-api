import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import {
  FileUploadRequestDto,
  FileUploadResponseDto,
} from 'src/dtos/upload.dto';
import { User } from 'src/entities/User.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UploadService } from 'src/services/upload.service';

@ApiTags('Uploads')
@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private cls: ClsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async getUploadParams(
    @Body() body: FileUploadRequestDto,
  ): Promise<FileUploadResponseDto> {
    const user = this.cls.get<User>('reqUser');
    return this.uploadService.generatePresignedUrl(user, body);
  }
}
