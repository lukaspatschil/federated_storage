import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

type PictureById = {
  id: number;
};

type Picture = {
  id: number;
  name: string;
};

@Controller()
export class AppController {
  @GrpcMethod('MinIOService', 'FindOne')
  findOne(
    data: PictureById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Picture {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];

    return items.find(({ id }) => id === data.id);
  }
}
