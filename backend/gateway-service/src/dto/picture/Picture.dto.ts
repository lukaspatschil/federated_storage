import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsDate,
  IsMimeType,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class PictureDto {
  @ApiProperty({ description: 'id of the picture entry', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Base64 data of picture', example: 'Base64' })
  @IsNotEmpty()
  @IsBase64()
  data: string;

  @ApiProperty({
    description: 'mimetype of the image',
    example: 'image/png',
  })
  @IsMimeType()
  @IsNotEmpty()
  mimetype: string;

  @ApiProperty({
    description: 'creation date (ISO 8601)',
    example: '2009-06-30T18:30:00+02:00',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: string;
}
