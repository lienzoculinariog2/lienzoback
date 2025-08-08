import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class FileUploadRepository {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            resolve(result!);
          }
        },
      );

      // ¡Aquí es donde escribes el buffer en el stream!
      toStream(file.buffer).pipe(upload);
    });
  }
}
