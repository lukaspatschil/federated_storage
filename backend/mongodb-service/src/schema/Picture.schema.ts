import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transform } from 'class-transformer';

@Schema()
export class Picture extends Document {
  @Transform((value) => value.toString())
  id: string;

  @Prop()
  createdAt: string;

  @Prop()
  mimetype: string;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
