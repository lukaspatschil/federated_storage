export class ShortPictureDto {
  id: string;
  createdAt: string;

  constructor(id: string, createdAt: string) {
    this.id = id;
    this.createdAt = createdAt;
  }

  static equals(a: ShortPictureDto, b: ShortPictureDto): boolean {
    return a.id === b.id && a.createdAt === b.createdAt;
  }
}
