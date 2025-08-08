import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { ProductsModule } from '../products/products.module';

export const CLOUDINARY = 'Cloudinary';

@Module({
  imports: [forwardRef(() => ProductsModule)],
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
  exports: [FileUploadService],
})
export class FileUploadModule {}
