import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'src/config/cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUpload } from './entities/file-upload.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ConfigModule,TypeOrmModule.forFeature([FileUpload]), ProductsModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, CloudinaryProvider],
  exports: [FileUploadService],
})
export class FileUploadModule {}
