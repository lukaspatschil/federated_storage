import { ApiProperty } from '@nestjs/swagger';

export class PictureDto {
  @ApiProperty({ description: 'id of the picture entry', example: '1' })
  id: string;

  @ApiProperty({ description: 'Base64 data of picture', example: 'Base64' })
  data: string;

  @ApiProperty({
    description: 'mimetype of the image',
    example: 'image/png',
  })
  mimetype: string;

  @ApiProperty({
    description: 'creation date (ISO 8601)',
    example: '2009-06-30T18:30:00+02:00',
  })
  createdAt: string;
}
