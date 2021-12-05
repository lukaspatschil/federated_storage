import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type PictureDocument = Picture & Document;

@Schema()
export class Picture {
  @Prop()
  id: string;

  @Prop()
  mimetype: string;

  @Prop()
  createdAt: Date;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
