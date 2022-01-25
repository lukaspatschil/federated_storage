import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from '../Location.dto';
import {
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateMetadataDto {
  @ApiProperty({ description: 'name of the file', example: 'GRASMERE 1' })
  @IsString({ message: 'name must be a string' })
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
    example: '22-Apr-2019 (00:53:00.000000)',
  })
  @IsNotEmpty()
  @Transform((data) => {
    const string = data.value.replace(/[(|)]/g, '').split('.');
    const date = new Date(string[0]);
    if (string.length > 1) {
      date.setMilliseconds(parseInt(string[1].substring(0, 3)));
    }
    return date;
  })
  @IsDate()
  datetime: Date;

  @ApiProperty({ description: 'frame number', example: 1 })
  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  frameNum: number;

  @ApiProperty({ description: 'sequence number frames', example: 1 })
  @IsNumber()
  @IsPositive()
  @Min(0)
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
  @IsString({ message: '' })
  @IsNotEmpty()
  deviceID: string;

  @ApiProperty({ description: 'location of the picture' })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
