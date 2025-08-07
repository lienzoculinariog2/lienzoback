import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import toStream from 'buffer-to-stream';
import { CLOUDINARY } from './constans';

@Injectable()
export class FileUploadService {
  constructor(@Inject(CLOUDINARY) private cloudinary_instance) {}

  async uploadImage(
    file: Express.Multer.File,
    productId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = this.cloudinary_instance.uploader.upload_stream(
        {
          folder: `products/${productId}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
