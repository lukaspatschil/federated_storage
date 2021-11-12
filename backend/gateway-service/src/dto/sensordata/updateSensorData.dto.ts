import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { UpdateMetadata } from '../metadata/UpdateMetadata.dto';

export class UpdateSensorDataDto {
  @ApiProperty()
  picture: CreatePictureDto;

  @ApiProperty()
  metadata: UpdateMetadata;
}
