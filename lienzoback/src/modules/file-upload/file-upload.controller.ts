import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseUUIDPipe,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ProductsService } from '../products/products.service';

@Controller('file-upload')
export class FileUploadController { 
   constructor(private readonly fileUploadService: FileUploadService,
               private readonly productsService: ProductsService) 
   {}
    
      @Post(':productId')
      @UseInterceptors(FileInterceptor('file'))
      async uploadProductImage(
        @Param('productId', ParseUUIDPipe) productId: string,
        @UploadedFile(
          new ParseFilePipe({
            validators: [
              new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
              new FileTypeValidator({ fileType: 'image/(jpeg|png|gif)' }), // Solo permite imágenes
            ],
          }),
        )
        file: Express.Multer.File,
      ) {
        const cloudinaryResponse = await this.fileUploadService.uploadImage(
      file,
      productId,
    );
     const updatedProduct = await this.productsService.updateProductImage(
      productId,
      cloudinaryResponse.secure_url, // Extrae la URL segura de la respuesta
    );
        return updatedProduct;
      }
}