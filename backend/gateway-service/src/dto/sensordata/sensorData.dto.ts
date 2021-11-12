import { ApiProperty } from '@nestjs/swagger';
import { ShortPictureDto } from '../picture/ShortPicture.dto';
import { MetadataDto } from '../metadata/Metadata.dto';

export class SensorDataDto {
  @ApiProperty({ description: 'id of the entry', example: '1' })
  id: string;

  @ApiProperty({ description: 'picture data', isArray: true })
  picture: ShortPictureDto[];

  @ApiProperty({
    description: 'metadata',
  })
  metadata: MetadataDto;
}
