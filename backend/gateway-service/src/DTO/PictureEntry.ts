import { ApiProperty } from '@nestjs/swagger';
import { Picture } from './Picture';
import { Metadata } from './Metadata';

export class PictureEntry {
  @ApiProperty({ description: 'picture data' })
  picture: Picture;

  @ApiProperty({
    description: 'metadata',
  })
  metadata: Metadata;
}
