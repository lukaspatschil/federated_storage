import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { UpdateMetadataDto } from '../metadata/UpdateMetadata.dto';
import { IsOptional, ValidateNested } from 'class-validator';

export class UpdateSensorDataDto {
  @ApiProperty({
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  picture?: CreatePictureDto;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  metadata?: UpdateMetadataDto;
}
