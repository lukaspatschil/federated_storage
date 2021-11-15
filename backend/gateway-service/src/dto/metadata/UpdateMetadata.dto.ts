import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty } from 'class-validator';

export class UpdateMetadata {
  @ApiProperty({
    description: 'tags of the picture',
    isArray: true,
    example: ['deer', 'grass', 'wood', 'duck'],
  })
  @ArrayNotEmpty()
  tags: string[];
}
