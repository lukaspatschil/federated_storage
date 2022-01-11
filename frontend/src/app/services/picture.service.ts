import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { PictureDto } from '../dtos/Picture.dto';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private readonly API_URL = 'http://localhost:3000/api/v1/sensordata/picture';
  private readonly _pictures: Map<string, PictureDto> = new Map();

  constructor(private readonly http: HttpClient) {}

  async getPicture(id: string): Promise<PictureDto> {
    let picture = this._pictures.get(id);
    if (picture) {
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      picture = await this.getPictureRequest(id);
    }

    return picture;
  }

  resetCache() {
    this._pictures.clear();
  }

  private async getPictureRequest(id: string): Promise<PictureDto> {
    // TODO: Not found?
    const picture = await firstValueFrom(
      this.http
        .get<PictureDto>(this.API_URL + '/' + id)
        .pipe(
          map(
            (picture) =>
              new PictureDto(
                picture?.id,
                picture?.data,
                picture?.mimetype,
                String(picture?.createdAt),
                picture?.replica
              )
          )
        )
    );

    this._pictures.set(id, picture);
    return picture;
  }
}
