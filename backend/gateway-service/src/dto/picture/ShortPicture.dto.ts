import { ApiProperty } from '@nestjs/swagger';

export class ShortPictureDto {
  @ApiProperty({ description: 'id of the picture entry', example: '1' })
  id: string;

  /*@ApiProperty({
    description: 'filename of the image',
    example: '0a914caf-2bfa-11e9-bcad-06f10d5896c4.jpg',
  })
  filename: string;*/

  /*@ApiProperty({
    description: 'Base64 encoding of the image',
    example: 'Base64',
  })
  data: string;*/

  @ApiProperty({
    description: 'creation date (ISO 8601)',
    example: '2009-06-30T18:30:00+02:00',
  })
  createdAt: string;
}
