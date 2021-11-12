import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { CreateMetadataDto } from '../metadata/CreateMetadata.dto';

export class CreateSensorDataDto {
  @ApiProperty({ description: 'picture data' })
  picture: CreatePictureDto;

  @ApiProperty({
    description: 'metadata',
  })
  metadata: CreateMetadataDto;
}
