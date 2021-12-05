import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { MetaData, MetaDataSchema } from './MetaData.schema';
import { Picture, PictureSchema } from './Picture.schema';
import { Transform } from 'class-transformer';

@Schema()
export class SensorData extends Document {
  @Transform((value) => value.toString())
  id: string;

  @Prop({ type: [PictureSchema] })
  pictures: Picture[];

  @Prop({ type: MetaDataSchema })
  metadata: MetaData;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);
