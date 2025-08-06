import { Inject, Injectable } from '@nestjs/common';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/update-file-upload.dto';
import * as cloudinary from 'src/config/cloudinary';
import { UploadApiResponse } from 'cloudinary';


@Injectable()
export class FileUploadService {
  constructor (@Inject(cloudinary.CLOUDINARY)
  private readonly cloudinary: cloudinary.Cloudinary) {}
   
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    this.cloudinary.uploader.upload_stream(
      {
        folder: 'products',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No result returned from Cloudinary'));
        resolve(result);
      },
    ).end(file.buffer);
  });
}
}
