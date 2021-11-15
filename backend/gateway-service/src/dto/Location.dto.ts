import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class LocationDto {
  @ApiProperty({
    description: 'longitude of the location of the picture',
    example: '-115.9043718414795',
  })
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'latitude of the location of the picture',
    example: '42.38461654217346',
  })
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;
}
