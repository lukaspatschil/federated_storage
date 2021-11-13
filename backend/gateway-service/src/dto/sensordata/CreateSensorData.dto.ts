import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { CreateMetadataDto } from '../metadata/CreateMetadata.dto';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';

export class CreateSensorDataDto {
  @ApiProperty({ description: 'picture data' })
  @IsNotEmptyObject()
  @ValidateNested()
  picture: CreatePictureDto;

  @ApiProperty({
    description: 'metadata',
  })
  @IsNotEmptyObject()
  @ValidateNested()
  metadata: CreateMetadataDto;
}
