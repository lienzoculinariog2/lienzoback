import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

export const CLOUDINARY = 'Cloudinary';

@Module({
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    {
      provide: CLOUDINARY,
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });
        return cloudinary;
      },
      inject: [ConfigService],
    },
  ],
})
export class FileUploadModule {}