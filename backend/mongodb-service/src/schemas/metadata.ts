import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose-geojson-schema';

//var GeoJSON = require('mongoogse-geojson-schema');

export type MetadataDocument = Metadata & Document;

@Schema()
export class Metadata {
  @Prop()
  placeIdent: string;

  @Prop()
  name: string;

  @Prop()
  seqId: string;

  @Prop()
  datetime: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  frameNum: number;

  @Prop()
  seqNumFrames: number;

  @Prop()
  devideId: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, ref: 'GeoJSON.Point' })
  location: mongoose.Schema.Types.Point;

  @Prop()
  tags: ['food', 'meat', 'zebra'];
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);
