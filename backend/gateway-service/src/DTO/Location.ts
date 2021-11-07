import { ApiProperty } from '@nestjs/swagger';

export class Location {
  @ApiProperty()
  longitude: string;

  @ApiProperty()
  latitude: string;
}
