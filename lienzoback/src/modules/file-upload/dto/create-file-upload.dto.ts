import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFileUploadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;

  @IsUUID()
  @IsOptional()
  productId?: string;
}
