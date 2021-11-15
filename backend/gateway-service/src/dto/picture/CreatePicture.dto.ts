import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsMimeType, IsNotEmpty } from 'class-validator';

export class CreatePictureDto {
  @ApiProperty({
    description: 'mimetype of the image',
    example: 'image/png',
  })
  @IsNotEmpty()
  @IsMimeType()
  mimetype: string;

  @ApiProperty({
    description: 'Base64 encoding of the image',
    example: 'base64image',
  })
  @IsBase64()
  @IsNotEmpty()
  data: string;
}
