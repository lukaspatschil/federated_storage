import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateMetadata {
  @ApiProperty({
    description: 'tags of the picture',
    isArray: true,
    example: ['deer', 'grass', 'wood', 'duck'],
  })
  @IsNotEmpty()
  tags: string[];
}
