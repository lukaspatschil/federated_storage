import { ApiProperty } from '@nestjs/swagger';
import { ShortPictureDto } from '../picture/ShortPicture.dto';
import { MetadataDto } from '../metadata/Metadata.dto';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SensorDataDto {
  @ApiProperty({ description: 'id of the entry', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'picture data', isArray: true })
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => ShortPictureDto)
  picture: ShortPictureDto[];

  @ApiProperty({
    description: 'metadata',
  })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}
