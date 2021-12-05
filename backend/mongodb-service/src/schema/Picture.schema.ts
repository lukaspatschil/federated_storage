import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PictureDocument extends Document {
  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop()
  mimetype: string;
}

export const PictureSchema = SchemaFactory.createForClass(PictureDocument);
