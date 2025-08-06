import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFileUploadDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsString()
  publicId: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
