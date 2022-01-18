import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from '../Location.dto';
import {
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MetadataDto {
  @ApiProperty({ description: 'name of the file', example: 'GRASMERE 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Place Identity', example: '031909GRAS01' })
  @IsString()
  @IsNotEmpty()
  placeIdent: string;

  @ApiProperty({
    description: 'id of the image sequence',
    example: '6ea10ab8-2e32-11e9-b03f-dca9047ef277',
  })
  @IsString()
  @IsNotEmpty()
  seqId: string;

  @ApiProperty({
    description: 'datetime of the captured image',
    example: '2009-06-30T18:30:00+02:00',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  datetime: Date;

  @ApiProperty({ description: 'frame number', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  frameNum: number;

  @ApiProperty({ description: 'number of image in the sequence', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  seqNumFrames: number;

  @ApiProperty({
    description: 'filename',
    example: '0a914caf-2bfa-11e9-bcad-06f10d5896c4.jpg',
  })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({
    description: 'Id of the device',
    example: 'b3f129b8-59f2-458f-bf2f-f0c1af0032d3',
  })
  @IsString()
  @IsNotEmpty()
  deviceID: string;

  @ApiProperty({ description: 'location of the picture' })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'tags of the picture',
    example: ['deer', 'grass', 'wood', 'duck'],
  })
  tags: string[];
}
