import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class MetaData extends Document {
  @Prop()
  name: string;

  @Prop()
  placeIdent: string;

  @Prop()
  seqId: string;

  @Prop()
  datetime: Date;

  @Prop()
  frameNum: number;

  @Prop()
  seqNumFrames: number;

  @Prop()
  filename: string;

  @Prop()
  deviceID: string;

  @Prop()
  location: string;

  @Prop({ type: [String] })
  tags: string[];
}

export const MetaDataSchema = SchemaFactory.createForClass(MetaData);
