import {ApiProperty} from "@nestjs/swagger";
import {GeoPoint} from "ts-geopoint";
import {Location} from "./Location";

export class Metadata {

    @ApiProperty()
    id: string;

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
    location: Location;

    @ApiProperty()
    tags: string[];
}
