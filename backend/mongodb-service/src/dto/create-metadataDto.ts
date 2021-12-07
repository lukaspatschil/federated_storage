import * as mongoose from 'mongoose-geojson-schema';

export class CreateMetadataDto {
  readonly placeIdent: string;
  readonly name: string;
  readonly seqId: string;
  readonly datetime: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly frameNum: number;
  readonly seqNumFrames: number;
  readonly devideId: string;
  readonly location: mongoose.Schema.Types.Point;
  readonly tags: ['food', 'meat', 'zebra'];
}
