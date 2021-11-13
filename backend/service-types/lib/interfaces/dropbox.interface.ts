import { Observable } from 'rxjs';

export interface DropboxServiceClient {
  findOne: (data: { id: number }) => Observable<{ id: number; name: string }>;
}
