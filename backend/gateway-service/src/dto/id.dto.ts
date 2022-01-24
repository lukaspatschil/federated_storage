import { IsMongoId } from 'class-validator';

export class idDto {
  @IsMongoId()
  public id: string;
}
