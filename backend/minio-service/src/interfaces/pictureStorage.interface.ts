import { Observable } from "rxjs";

interface PictureStorageServcice {
    getPictureById(upstream: Observable<id>): Observable<Data>;
    createPictureById(upstream: Observable<CreatePictureEntity>): Observable<Res>;
    removePictureById(upstream: Observable<id>): Observable<Res>;
  }

interface id {
    id: string;
}

interface CreatePictureEntity {
    id: string;
    mimeType: string;
    data: any;
}

interface Data {
    data: any;
}

interface Res {
    // we send an empty message because we just want the http status code
}
