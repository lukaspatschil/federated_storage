import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { UpdateMetadata } from '../metadata/UpdateMetadata.dto';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';

export class UpdateSensorDataDto {
  @ApiProperty({
    required: false,
  })
  @ValidateNested()
  picture: CreatePictureDto;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmptyObject()
  metadata: UpdateMetadata;
}
