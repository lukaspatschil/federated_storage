import { Observable } from "rxjs";

export interface MongoDBServiceClient {
  findOne: (data: { id: number }) => Observable<{ id: number; name: string }>;
}
