import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LocationDocument } from './Location.schema';

@Schema({ _id: false })
export class MetaData extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  placeIdent: string;

  @Prop({ required: true })
  seqId: string;

  @Prop({ type: Date, required: true })
  datetime: Date;

  @Prop({ required: true })
  frameNum: number;

  @Prop({ required: true })
  seqNumFrames: number;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  deviceID: string;

  @Prop(LocationDocument)
  location: LocationDocument;

  @Prop({ type: [String] })
  tags: string[];
}

export const MetaDataSchema = SchemaFactory.createForClass(MetaData);
