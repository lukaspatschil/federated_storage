import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoDBService {
  getHello(): string {
    return 'Hello World!';
  }
}
