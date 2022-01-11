export enum Replica {
  OK = 'OK',
  MISSING = 'MISSING',
  FAULTY = 'FAULTY'
}

export class PictureDto {
  id: string;
  data: string;
  mimetype: string;
  createdAt: Date;
  replica: Replica;

  constructor(
    id: string,
    data: string,
    mimetype: string,
    createdAt: string,
    replica: Replica
  ) {
    this.id = id;
    this.data = data;
    this.mimetype = mimetype;
    this.createdAt = new Date(createdAt);
    this.replica = replica;
  }

  get pictureSrc(): string | null {
    if (this.mimetype && this.data) {
      return `data:${this.mimetype};base64,${this.data}`;
    } else {
      return null;
    }
  }

  static equals(a: PictureDto, b: PictureDto): boolean {
    return (
      a.id === b.id &&
      a.data === b.data &&
      a.mimetype === b.mimetype &&
      a.createdAt.getTime() === b.createdAt.getTime()
    );
  }

  static newEmpty(): PictureDto {
    return new PictureDto('', '', '', '', Replica.MISSING);
  }
}
