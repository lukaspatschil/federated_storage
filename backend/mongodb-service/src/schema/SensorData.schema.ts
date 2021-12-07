import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { MetaData, MetaDataSchema } from './MetaData.schema';
import { PictureDocument, PictureSchema } from './Picture.schema';
import { Transform } from 'class-transformer';
import { truncate } from 'fs';

@Schema()
export class SensorDataDocument extends Document {
  @Prop({ type: [PictureSchema], required: true })
  pictures: PictureDocument[];

  @Prop({ type: MetaDataSchema, required: true })
  metadata: MetaData;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const SensorDataSchema =
  SchemaFactory.createForClass(SensorDataDocument);
