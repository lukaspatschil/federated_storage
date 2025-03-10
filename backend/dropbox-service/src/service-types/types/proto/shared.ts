/* eslint-disable */
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "";

export interface Empty {}

export interface Id {
  id: string;
}

export interface IdWithMimetype {
  id: string;
  mimetype: string;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export interface MetaDataCreation {
  name: string;
  placeIdent: string;
  seqId: string;
  datetime: string;
  frameNum: number;
  seqNumFrames: number;
  filename: string;
  deviceID: string;
  location: Location | undefined;
}

export interface MetaData {
  name: string;
  placeIdent: string;
  seqId: string;
  datetime: string;
  frameNum: number;
  seqNumFrames: number;
  filename: string;
  deviceID: string;
  location: Location | undefined;
  tags: string[];
}

export interface MetaDataUpdate {
  name?: string | undefined;
  placeIdent?: string | undefined;
  seqId?: string | undefined;
  datetime?: string | undefined;
  frameNum?: number | undefined;
  seqNumFrames?: number | undefined;
  filename?: string | undefined;
  deviceID?: string | undefined;
  location: Location | undefined;
  tagsWrapper: TagsWrapper | undefined;
}

export interface TagsWrapper {
  tags: string[];
}

export interface PictureCreation {
  mimetype: string;
  data: Buffer;
}

export interface PictureCreationWithoutData {
  mimetype: string;
  hash: string;
}

export interface PictureCreationById {
  id: string;
  mimetype: string;
  data: Buffer;
}

export interface PictureWithoutData {
  id: string;
  createdAt: string;
  mimetype: string;
  hash: string;
}

export interface PictureWithoutDataArray {
  pictures: PictureWithoutData[];
}

export interface PictureData {
  data: Buffer;
}

export interface Picture {
  id: string;
  mimetype: string;
  data: Buffer;
  createdAt: string;
  replica: string;
}

export interface SensorDataCreation {
  picture: PictureCreation | undefined;
  metadata: MetaDataCreation | undefined;
}

export interface SensorDataCreationWithoutPictureData {
  picture: PictureCreationWithoutData | undefined;
  metadata: MetaDataCreation | undefined;
}

export interface SensorData {
  id: string;
  pictures: PictureWithoutData[];
  metadata: MetaData | undefined;
}

export interface SensorDataUpdate {
  id: string;
  picture: PictureCreation | undefined;
  metadata: MetaDataUpdate | undefined;
}

export interface SensorDataWithoutPictureDataUpdate {
  id: string;
  picture: PictureCreationWithoutData | undefined;
  metadata: MetaDataUpdate | undefined;
}

export interface SensorDataArray {
  sensorData: SensorData[];
}

export const _PACKAGE_NAME = "";

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
