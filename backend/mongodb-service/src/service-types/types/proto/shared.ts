/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

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

export interface PictureCreation {
  mimetype: string;
  data: Buffer;
}

export interface PictureCreationWithoutData {
  mimetype: string;
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
}

export interface PictureData {
  data: Buffer;
}

export interface Picture {
  id: string;
  mimetype: string;
  data: Buffer;
  createdAt: string;
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

export interface SensorDataArray {
  sensorData: SensorData[];
}

export const _PACKAGE_NAME = "";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
