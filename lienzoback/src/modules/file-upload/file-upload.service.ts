import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from './entities/file-upload.entity';
import { Repository } from 'typeorm';
import { CLOUDINARY, Cloudinary } from 'src/config/cloudinary';
import { Inject } from '@nestjs/common';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinary: Cloudinary,
    @InjectRepository(FileUpload)
    private readonly fileRepo: Repository<FileUpload>,
    private readonly productsService: ProductsService
  ) {}

  async uploadImage(file: Express.Multer.File, productId: string): Promise<FileUpload> {
    const product = await this.productsService.findOne(productId);

    const uploaded = await new Promise<any>((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });

    const fileUpload = this.fileRepo.create({
      publicId: uploaded.public_id,
      url: uploaded.secure_url,
      product,
    });

    return this.fileRepo.save(fileUpload);
  }
}
