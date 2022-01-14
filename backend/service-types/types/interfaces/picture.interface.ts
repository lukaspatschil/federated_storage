import { Observable } from "rxjs";

export interface PictureServiceClient {
  findOne: (data: { id: number }) => Observable<{ id: number; name: string }>;
}
