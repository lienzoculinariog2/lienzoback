import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { FileUploadService } from '../file-upload/file-upload.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [FileUploadService],
})
export class ProductsModule {}
