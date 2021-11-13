import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ShortPictureDto {
  @ApiProperty({ description: 'id of the picture entry', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'creation date (ISO 8601)',
    example: '2009-06-30T18:30:00+02:00',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: string;
}
