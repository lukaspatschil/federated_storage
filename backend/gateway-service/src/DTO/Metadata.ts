import { ApiProperty } from '@nestjs/swagger';
import { Location } from './Location';

export class Metadata {
  @ApiProperty()
  id: string;

  @ApiProperty()
  placeIdent: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  seqID: string;

  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  frameNum: number;

  @ApiProperty()
  seqNumFrames: number;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  deviceID: string;

  @ApiProperty()
  location: Location;

  @ApiProperty()
  tags: string[];
}
