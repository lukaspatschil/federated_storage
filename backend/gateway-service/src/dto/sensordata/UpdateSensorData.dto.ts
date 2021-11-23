import { ApiProperty } from '@nestjs/swagger';
import { CreatePictureDto } from '../picture/CreatePicture.dto';
import { UpdateMetadata } from '../metadata/UpdateMetadata.dto';
import { IsNotEmptyObject, IsOptional, ValidateNested } from 'class-validator';

export class UpdateSensorDataDto {
  @ApiProperty({
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  picture: CreatePictureDto;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmptyObject()
  metadata: UpdateMetadata;
}
