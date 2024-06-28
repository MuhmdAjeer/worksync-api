import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
// import { fromIni } from '@aws-sdk/credential-providers';
import { S3, S3ClientConfig } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import {
  FileUploadRequestDto,
  FileUploadResponseDto,
  FileUploadType,
} from 'src/dtos/upload.dto';
import { ConfigService } from '@nestjs/config';
import {
  FileUpload,
  FileUploadRepository,
} from 'src/entities/FileUpload.entity';
import { User } from 'src/entities/User.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  private s3Client: S3;
  private s3Bucket: string;
  private s3BucketPublicUrl: string;

  constructor(
    configService: ConfigService,
    private uploadedFileRepo: FileUploadRepository,
  ) {
    const isDevEnv = configService.get('NODE_ENV') === 'development';

    const s3Profile = configService.get<string>('S3_PROFILE');

    const s3Url = configService.get<string>(`S3_URL`);

    this.s3Bucket = configService.getOrThrow('S3_BUCKET_NAME');
    this.s3BucketPublicUrl = configService.getOrThrow(`S3_BUCKET_PUBLIC_URL`);

    const s3ClientConfig: S3ClientConfig = {
      region: configService.getOrThrow('S3_REGION'),
      forcePathStyle: true,
      useGlobalEndpoint: true,
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY'),
        secretAccessKey: configService.getOrThrow('AWS_SECRET_KEY'),
      },
    };

    if (isDevEnv) {
      if (s3Profile) {
        // s3ClientConfig.credentials = fromIni({ profile: s3Profile });
      } else if (s3Url) {
        s3ClientConfig.endpoint = s3Url;
      } else {
        throw new Error(
          "Must provide either 'S3_PROFILE' environment or 'S3_URL' (localstack)",
        );
      }
    }
    // EC2 has direct access to s3 via aws-roles so no creds needed
    this.s3Client = new S3(s3ClientConfig);
  }

  private generateFileKey(
    userId: string,
    type: FileUploadType,
    fileName = '',
  ): string {
    const currDateYMD = format(new Date(), 'yyyy-mm-dd');
    return `public/${userId}/${type}/${currDateYMD}/${uuid()}_${fileName}`;
  }

  private getPubicUrlFromFileKey(fileKey: string): string {
    return `${this.s3BucketPublicUrl}/${fileKey}`;
  }

  private async saveUploadedFile(
    user: User,
    publicUrl: string,
    type: FileUploadType,
    fileName: string,
    fileKey: string,
  ): Promise<void> {
    const uploadedFile = new FileUpload({
      user,
      type,
      file_name: fileName,
      public_url: publicUrl,
      file_key: fileKey,
    });
    await this.uploadedFileRepo
      .getEntityManager()
      .persistAndFlush(uploadedFile);
  }

  async generatePresignedUrl(
    user: User,
    uploadDto: FileUploadRequestDto,
  ): Promise<FileUploadResponseDto> {
    const { file_name, type } = uploadDto;
    const fileKey = this.generateFileKey(user.id, type, file_name);

    const params = await createPresignedPost(this.s3Client, {
      Bucket: this.s3Bucket,
      Key: fileKey,
      ...(uploadDto.mimeType && {
        Fields: {
          [`Content-Type`]: uploadDto.mimeType,
        },
      }),
    });

    const publicUrl = this.getPubicUrlFromFileKey(fileKey);
    await this.saveUploadedFile(user, publicUrl, type, file_name, fileKey);

    return {
      public_url: publicUrl,
      url: params.url,
      fields: params.fields,
    };
  }

  async uploadFile(
    user: User,
    type: FileUploadType,
    file: Buffer,
    fileName = '',
  ): Promise<string> {
    const fileKey = this.generateFileKey(user.id, type, fileName);
    await this.s3Client.putObject({
      Bucket: this.s3Bucket,
      Key: fileKey,
      Body: file,
    });
    const publicUrl = this.getPubicUrlFromFileKey(fileKey);
    await this.saveUploadedFile(user, publicUrl, type, fileName, fileKey);
    return publicUrl;
  }
}
