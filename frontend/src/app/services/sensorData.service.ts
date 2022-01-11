import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CreateSensorDataDto } from '../dtos/CreateSensorData.dto';
import { LocationDto } from '../dtos/Location.dto';
import { MetadataDto } from '../dtos/Metadata.dto';
import { SensorDataDto } from '../dtos/SensorData.dto';
import { ShortPictureDto } from '../dtos/ShortPicture.dto';

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  private readonly API_URL = 'http://localhost:3000/api/v1/sensordata';
  // TODO: Change to Map with observables?
  private readonly _sensorData = new BehaviorSubject<
    BehaviorSubject<SensorDataDto>[]
  >([]);
  private readonly _allSensorData = new BehaviorSubject<SensorDataDto[]>([]);

  readonly sensorData$ = this._allSensorData.asObservable();

  constructor(private readonly http: HttpClient) {
    this.getSensorDataRequest().subscribe((data) => (this.sensorData = data));
    this._sensorData.subscribe((data) =>
      this._allSensorData.next(data.map((entry) => entry.getValue()))
    );
  }

  sensorDataEntry$(id: string): Observable<SensorDataDto> {
    const entry = this.sensorDataEntry(id);
    if (!entry) {
      throw new Error('Do not do this!');
    }
    return entry.asObservable();
  }

  get sensorData(): SensorDataDto[] {
    return this._sensorData.getValue().map((entry) => entry.getValue());
  }

  private set sensorData(data: SensorDataDto[]) {
    this._sensorData.next(
      data.map((entry) => {
        const cacheEntry = this.sensorDataEntry(entry.id);
        const newEntry =
          cacheEntry ?? new BehaviorSubject<SensorDataDto>(entry);
        if (cacheEntry) {
          cacheEntry.next(entry);
        }

        return newEntry;
      })
    );
  }

  private sensorDataEntry(
    id: string
  ): BehaviorSubject<SensorDataDto> | undefined {
    return this._sensorData
      .getValue()
      .find((entry) => entry.getValue().id === id);
  }

  getSensorData(id: string): SensorDataDto | undefined {
    return this.sensorData.find((entry) => entry.id === id);
  }

  createSensorData(
    createSensorDataDto: CreateSensorDataDto
  ): Observable<SensorDataDto> {
    return this.http.post<any>(this.API_URL, createSensorDataDto).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
        this.updateWholeSensorData();
      })
    );
  }

  deleteSensorData(id: string) {
    this.http.delete(`${this.API_URL}/${id}`).subscribe((data) => {
      console.log('Deleted' + JSON.stringify(data));
      this.updateWholeSensorData();
    });
  }

  updateSensorData() {
    // Update in cache on success
  }

  updateWholeSensorData() {
    this.getSensorDataRequest().subscribe((data) => {
      if (
        data.length !== this.sensorData.length ||
        !data.every((entry, index) =>
          SensorDataDto.equals(entry, this.sensorData[index])
        )
      ) {
        console.log('Cache miss');
        this.sensorData = data;
      } else {
        console.log('Cache hit');
      }
    });
  }

  resetCache() {
    this.sensorData = [];
    this.getSensorDataRequest().subscribe((data) => (this.sensorData = data));
  }

  private getSensorDataRequest(): Observable<SensorDataDto[]> {
    return this.http.get<SensorDataDto[]>(this.API_URL).pipe(
      map((sensorData) => {
        return sensorData.map((entry: SensorDataDto) => {
          const pictures = entry?.pictures?.map(
            (picture: ShortPictureDto) =>
              new ShortPictureDto(picture.id, picture.createdAt)
          );
          const metadata = new MetadataDto(
            entry?.metadata?.name,
            entry?.metadata?.placeIdent,
            entry?.metadata?.seqId,
            new Date((entry?.metadata?.datetime as unknown as string).replace('(', '').replace(')', '')),
            entry?.metadata?.frameNum,
            entry?.metadata?.seqNumFrames,
            entry?.metadata?.filename,
            entry?.metadata?.deviceID,
            new LocationDto(
              entry?.metadata?.location?.longitude,
              entry?.metadata?.location?.latitude
            ),
            entry?.metadata?.tags ?? []
          );

          return new SensorDataDto(entry?.id, pictures, metadata);
        });
      })
    );
  }
}
