import { ApiProperty } from '@nestjs/swagger';

export class Location {
  @ApiProperty({
    description: 'longitude of the location of the picture',
    example: '-115.9043718414795',
  })
  longitude: string;

  @ApiProperty({
    description: 'latitude of the location of the picture',
    example: '42.38461654217346',
  })
  latitude: string;
}
