import { Observable } from 'rxjs';
export interface MinIOServiceClient {
    findOne: (data: {
        id: number;
    }) => Observable<{
        id: number;
        name: string;
    }>;
}
