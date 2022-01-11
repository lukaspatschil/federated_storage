import { MetadataDto } from './Metadata.dto';
import { PictureDto } from './Picture.dto';

export class CreateSensorDataDto {
  picture: Partial<PictureDto>;
  metadata: MetadataDto;

  constructor(picture: Partial<PictureDto>, metadata: MetadataDto) {
    this.picture = picture;
    this.metadata = metadata;
  }

  static newEmpty(): CreateSensorDataDto {
    return new CreateSensorDataDto(
      PictureDto.newEmpty(),
      MetadataDto.newEmpty()
    );
  }
}
