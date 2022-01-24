import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
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
  private readonly _sensorData = new BehaviorSubject<SensorDataDto[]>([]);

  readonly sensorData$ = this._sensorData.asObservable();

  constructor(private readonly http: HttpClient) {
    this.getSensorDataRequest().subscribe((data) => (this.sensorData = data));
  }

  sensorDataEntry$(id: string): SensorDataDto {
    const entry = this.sensorDataEntry(id);
    if (!entry) {
      throw new Error('Do not do this!');
    }
    return entry;
  }

  get sensorData(): SensorDataDto[] {
    return this._sensorData.getValue();
  }

  private set sensorData(data: SensorDataDto[]) {
    this._sensorData.next(data);
  }

  private sensorDataEntry(id: string): SensorDataDto | undefined {
    return this._sensorData.getValue().find((entry) => entry.id === id);
  }

  getSensorData(id: string): SensorDataDto | undefined {
    return this.sensorData.find((entry) => entry.id === id);
  }

  createSensorData(createSensorDataDto: CreateSensorDataDto) {
    this.http.post<any>(this.API_URL, createSensorDataDto).subscribe((data) => {
      console.log(JSON.stringify(data));
      this.updateWholeSensorData();
    });
  }

  deleteSensorData(id: string) {
    this.http.delete(`${this.API_URL}/${id}`).subscribe((data) => {
      console.log('Deleted' + JSON.stringify(data));
      this.updateWholeSensorData();
    });
  }

  updateSensorData(id: string, sensorData: CreateSensorDataDto) {
    // Update in cache on success
    this.http.put(`${this.API_URL}/${id}`, sensorData).subscribe((data) => {
      console.log('Updated' + JSON.stringify(data));
      this.updateWholeSensorData();
    });
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
            new Date(
              (entry?.metadata?.datetime as unknown as string)
                .replace('(', '')
                .replace(')', '')
            ),
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
