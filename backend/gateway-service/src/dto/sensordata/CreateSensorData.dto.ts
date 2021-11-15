import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { CreateMetadataDto } from '../metadata/CreateMetadata.dto';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSensorDataDto {
  @ApiProperty({ description: 'picture data' })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreatePictureDto)
  picture: CreatePictureDto;

  @ApiProperty({ description: 'metadata' })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateMetadataDto)
  metadata: CreateMetadataDto;
}
