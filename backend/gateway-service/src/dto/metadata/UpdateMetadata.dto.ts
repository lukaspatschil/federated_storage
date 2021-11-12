import { ApiProperty } from '@nestjs/swagger';

export class UpdateMetadata {
  @ApiProperty({
    description: 'tags of the picture',
    isArray: true,
    example: ['deer', 'grass', 'wood', 'duck'],
  })
  tags: string[];
}
