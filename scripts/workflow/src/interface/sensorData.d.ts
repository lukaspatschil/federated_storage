export interface ISensorData {
  id?: string;
  picture: {
      mimetype: string | false;
      data: string;
  };
  metadata: {
      name: string;
      placeIdent: string;
      seqId: string;
      datetime: string;
      frameNum: number;
      seqNumFrames: number;
      filename: string;
      deviceID: string;
      location: {
          longitude: number;
          latitude: number;
      };
  };
}