import { ApiProperty } from '@nestjs/swagger';

export class CreatePictureDto {
  @ApiProperty({
    description: 'mimetype of the image',
    example: 'image/png',
  })
  mimetype: string;

  @ApiProperty({
    description: 'Base64 encoding of the image',
    example: 'Base64',
  })
  data: string;
}
