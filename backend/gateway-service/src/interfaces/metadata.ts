import {ApiProperty} from "@nestjs/swagger";
import {GeoPoint} from "ts-geopoint";

export class Metadata {

    @ApiProperty()
    id: number;

    @ApiProperty()
    place_ident: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    seq_id: string;

    @ApiProperty()
    datetime: Date;

    @ApiProperty()
    frame_num: number;

    @ApiProperty()
    seq_num_frames: number;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    device_id: string;

    @ApiProperty()
    location: GeoPoint;

    @ApiProperty()
    tags: string[];
}
