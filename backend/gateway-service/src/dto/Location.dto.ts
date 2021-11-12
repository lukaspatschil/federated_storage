import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    description: 'longitude of the location of the picture',
    example: '-115.9043718414795',
  })
  longitude: number;

  @ApiProperty({
    description: 'latitude of the location of the picture',
    example: '42.38461654217346',
  })
  latitude: number;
}
