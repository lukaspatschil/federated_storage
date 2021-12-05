import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

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

  @Prop()
  location: string;
  @Prop()
  tags: ['food', 'meat', 'zebra'];
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);
