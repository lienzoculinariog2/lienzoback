// src/modules/file-upload/file-upload.module.ts
import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../products/entities/product.entity';
import { FileUploadRepository } from './file-upload.repository'; // Importa el repositorio

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  controllers: [FileUploadController],
  // Asegúrate de que FileUploadRepository esté en la lista de providers
  providers: [FileUploadService, CloudinaryConfig, FileUploadRepository],
})
export class FileUploadModule {}
