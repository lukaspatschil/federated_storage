import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Metadata } from './metadata';
import { Picture } from './picture';

export type InputDocument = Input & Document;

@Schema()
export class Input {
  @Prop()
  id: string;

  @Prop({ type: Metadata, ref: 'Metadata' })
  metadata: Metadata;

  @Prop({ type: [{ type: Picture, ref: 'Picture' }] })
  pictures: Picture[];
}

export const InputSchema = SchemaFactory.createForClass(Input);
