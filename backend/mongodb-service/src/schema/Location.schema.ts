import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LocationDocument extends Document {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: string;

  @Prop([Number])
  coordinates: number[];
}

export const LocationSchema = SchemaFactory.createForClass(LocationDocument);
