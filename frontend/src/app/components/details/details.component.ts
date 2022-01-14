import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { PictureDto } from 'src/app/dtos/Picture.dto';
import { SensorDataDto } from 'src/app/dtos/SensorData.dto';
import { PictureService } from 'src/app/services/picture.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: []
})
export class DetailsComponent implements OnInit {
  @Input()
  displayedMetaData: SensorDataDto;

  @Output() closeModal = new EventEmitter<void>();

  displayed: string;
  displayedPictures: PictureDto[];
  sensorDataForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly pictureService: PictureService
  ) {}

  ngOnInit(): void {
    const datetime = {
      day: this.displayedMetaData?.metadata?.datetime.getDate(),
      month: this.displayedMetaData?.metadata?.datetime.getMonth() + 1,
      year: this.displayedMetaData?.metadata?.datetime.getFullYear()
    };

    const time = {
      hour: this.displayedMetaData?.metadata?.datetime.getHours(),
      minute: this.displayedMetaData?.metadata?.datetime.getMinutes(),
      second: this.displayedMetaData?.metadata?.datetime.getSeconds()
    };

    this.sensorDataForm = this.formBuilder.group({
      name: [this.displayedMetaData?.metadata?.name, [Validators.required]],
      placeIdent: [
        this.displayedMetaData?.metadata?.placeIdent,
        [Validators.required]
      ],
      datetime: [datetime, [Validators.required]],
      time: [time, [Validators.required]],
      deviceID: [
        this.displayedMetaData?.metadata?.deviceID,
        [Validators.required]
      ],
      filename: [
        this.displayedMetaData?.metadata?.filename,
        [Validators.required]
      ],
      frameNum: [
        this.displayedMetaData?.metadata?.frameNum,
        [Validators.required, Validators.min(0)]
      ],
      seqID: [this.displayedMetaData?.metadata?.seqId, [Validators.required]],
      seqNumFrames: [
        this.displayedMetaData?.metadata?.seqNumFrames,
        [Validators.required, Validators.min(0)]
      ],
      latitude: [
        this.displayedMetaData?.metadata?.location?.latitude,
        [Validators.required, Validators.min(-90), Validators.max(90)]
      ],
      longitude: [
        this.displayedMetaData?.metadata?.location?.longitude,
        [Validators.required, Validators.min(-180), Validators.max(180)]
      ],
      tags: [this.displayedMetaData?.metadata?.tags, []]
    });

    this.displayed = 'metadata';
    this.displayedPictures = [];

    Promise.all(
      this.displayedMetaData.pictures.map((picture) =>
        this.pictureService.getPicture(picture.id)
      )
    )
      .then((pictures) => (this.displayedPictures = pictures))
      .catch((error) => console.error(error));
  }

  navigation(id: string | number) {
    this.displayed = id.toString();
  }

  close() {
    this.closeModal.emit();
  }

  save() {
    throw new Error('Not implemented');
  }

  get name(): AbstractControl | null {
    return this.sensorDataForm.get('name');
  }

  get placeIdent(): AbstractControl | null {
    return this.sensorDataForm.get('placeIdent');
  }

  get datetime(): AbstractControl | null {
    return this.sensorDataForm.get('datetime');
  }

  get time(): AbstractControl {
    return this.sensorDataForm.get('time') as AbstractControl;
  }

  get deviceID(): AbstractControl | null {
    return this.sensorDataForm.get('deviceID');
  }

  get filename(): AbstractControl | null {
    return this.sensorDataForm.get('filename');
  }

  get frameNum(): AbstractControl | null {
    return this.sensorDataForm.get('frameNum');
  }

  get seqID(): AbstractControl | null {
    return this.sensorDataForm.get('seqID');
  }

  get seqNumFrames(): AbstractControl | null {
    return this.sensorDataForm.get('seqNumFrames');
  }

  get latitude(): AbstractControl | null {
    return this.sensorDataForm.get('latitude');
  }

  get longitude(): AbstractControl | null {
    return this.sensorDataForm.get('longitude');
  }

  get tags(): AbstractControl | null {
    return this.sensorDataForm.get('tags');
  }
}
