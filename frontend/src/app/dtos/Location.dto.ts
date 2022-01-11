export class LocationDto {
  longitude: number;
  latitude: number;

  constructor(longitude: number, latitude: number) {
    this.longitude = longitude;
    this.latitude = latitude;
  }

  static equals(a: LocationDto, b: LocationDto): boolean {
    return a.longitude === b.longitude && a.latitude === b.latitude;
  }

  static newEmpty(): LocationDto {
    return new LocationDto(0, 0);
  }
}
