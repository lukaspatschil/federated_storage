import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { UpdateMetadata } from '../metadata/UpdateMetadata.dto';
import { IsNotEmptyObject } from 'class-validator';

export class UpdateSensorDataDto {
  @ApiProperty({
    required: false,
  })
  picture: CreatePictureDto;

  @ApiProperty()
  @IsNotEmptyObject()
  metadata: UpdateMetadata;
}
