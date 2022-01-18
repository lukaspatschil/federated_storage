import { LocationDto } from './Location.dto';

export class MetadataDto {
  name: string;
  placeIdent: string;
  seqId: string;
  datetime: Date;
  frameNum: number;
  seqNumFrames: number;
  filename: string;
  deviceID: string;
  location: LocationDto;
  tags: string[];

  constructor(
    name: string,
    placeIdent: string,
    seqId: string,
    datetime: Date,
    frameNum: number,
    seqNumFrames: number,
    filename: string,
    deviceID: string,
    location: LocationDto,
    tags: string[]
  ) {
    this.name = name;
    this.placeIdent = placeIdent;
    this.seqId = seqId;
    this.datetime = datetime;
    this.frameNum = frameNum;
    this.seqNumFrames = seqNumFrames;
    this.filename = filename;
    this.deviceID = deviceID;
    this.location = location;
    this.tags = tags;
  }

  static equals(a: MetadataDto, b: MetadataDto): boolean {
    return (
      a.name === b.name &&
      a.placeIdent === b.placeIdent &&
      a.seqId === b.seqId &&
      a.datetime.getTime() === b.datetime.getTime() &&
      a.frameNum === b.frameNum &&
      a.seqNumFrames === b.seqNumFrames &&
      a.filename === b.filename &&
      a.deviceID === b.deviceID &&
      LocationDto.equals(a.location, b.location) &&
      a.tags.length === b.tags.length &&
      a.tags.every((tag, index) => tag === b.tags[index])
    );
  }

  static newEmpty(): MetadataDto {
    return new MetadataDto(
      '',
      '',
      '',
      new Date(),
      0,
      0,
      '',
      '',
      LocationDto.newEmpty(),
      []
    );
  }
}
