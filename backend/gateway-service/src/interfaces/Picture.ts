import {ApiProperty} from "@nestjs/swagger";

export class Picture{

    @ApiProperty()
    id: number;

    @ApiProperty()
    image: String;
}
