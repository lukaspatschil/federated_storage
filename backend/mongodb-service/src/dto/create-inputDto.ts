import { CreateMetadataDto } from './create-metadataDto';
import { CreatePictureDto } from './create-pictureDto';

export class CreateInputDto {
  readonly id: string;
  readonly metadata: CreateMetadataDto;
  readonly picture: CreatePictureDto[];
}
