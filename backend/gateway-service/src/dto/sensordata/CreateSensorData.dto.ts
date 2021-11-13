import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { CreateMetadataDto } from '../metadata/CreateMetadata.dto';
import { IsNotEmptyObject } from 'class-validator';

export class CreateSensorDataDto {
  @ApiProperty({ description: 'picture data' })
  @IsNotEmptyObject()
  picture: CreatePictureDto;

  @ApiProperty({
    description: 'metadata',
  })
  @IsNotEmptyObject()
  metadata: CreateMetadataDto;
}
