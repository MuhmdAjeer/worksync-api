import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum FileUploadType {
  USER_IMAGE = 'user_image',
}
export class FileUploadRequestDto {
  @IsEnum(FileUploadType)
  @IsNotEmpty()
  @ApiProperty({ enum: FileUploadType })
  type: FileUploadType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  file_name: string;

  @IsOptional()
  @ApiProperty()
  mimeType?: string;
}

export class FileUploadResponseDto {
  @ApiProperty()
  url: string;
  @ApiProperty()
  fields: Record<string, string>;
  @ApiProperty()
  public_url: string;
}
