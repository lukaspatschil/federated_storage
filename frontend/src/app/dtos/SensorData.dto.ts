import { ShortPictureDto } from './ShortPicture.dto';
import { MetadataDto } from './Metadata.dto';

export class SensorDataDto {
  id: string;
  pictures: ShortPictureDto[];
  metadata: MetadataDto;

  constructor(id: string, pictures: ShortPictureDto[], metadata: MetadataDto) {
    this.id = id;
    this.pictures = pictures;
    this.metadata = metadata;
  }

  static equals(a: SensorDataDto, b: SensorDataDto): boolean {
    return (
      a.id === b.id &&
      a.pictures.every((picture, index) =>
        ShortPictureDto.equals(picture, b.pictures[index])
      ) &&
      MetadataDto.equals(a.metadata, b.metadata)
    );
  }

  static newEmpty(): SensorDataDto {
    return new SensorDataDto('', [], MetadataDto.newEmpty());
  }
}
