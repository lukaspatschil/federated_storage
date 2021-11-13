import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsDate,
  IsMimeType,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNotIn,
} from 'class-validator';

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
    example: 'Base64',
  })
  @IsBase64()
  @IsNotEmpty()
  @IsNotEmptyObject()
  data: string;
}
