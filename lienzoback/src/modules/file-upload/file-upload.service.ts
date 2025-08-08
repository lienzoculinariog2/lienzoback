// src/modules/file-upload/file-upload.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../products/entities/product.entity';
import { FileUploadRepository } from './file-upload.repository'; // Importa el repositorio

@Injectable()
export class FileUploadService {
  constructor(
    // Inyecta el repositorio, no el servicio
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    // Llama al método del repositorio inyectado
    const uploadResponse = await this.fileUploadRepository.uploadImage(file);

    await this.productsRepository.update(product.id, {
      imgUrl: uploadResponse.secure_url,
    });
    return this.productsRepository.findOneBy({ id: productId });
  }
}
