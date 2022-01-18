import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CreateSensorDataDto } from 'src/app/dtos/CreateSensorData.dto';
import { LocationDto } from 'src/app/dtos/Location.dto';
import { MetadataDto } from 'src/app/dtos/Metadata.dto';
import { PictureDto } from 'src/app/dtos/Picture.dto';
import { SensorDataDto } from 'src/app/dtos/SensorData.dto';
import { PictureService } from 'src/app/services/picture.service';
import { SensorDataService } from 'src/app/services/sensorData.service';
import { requiredFileType } from 'src/app/validators/requiredFileType';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
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
    private readonly pictureService: PictureService,
    private readonly sensorDataService: SensorDataService
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
      tags: [this.displayedMetaData?.metadata?.tags.toString(), []],
      newPicture: [undefined, [requiredFileType]]
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
    if (this.sensorDataForm.valid) {
      const dirtyValues = this.getDirtyValues(this.sensorDataForm);

      if (Object.values(dirtyValues).length) {
        delete dirtyValues['newPicture'];

        const metadataDto: Partial<MetadataDto> = { ...dirtyValues };

        if (this.latitude?.dirty  || this.longitude?.dirty) {
          metadataDto.location = new LocationDto(this.longitude?.value, this.latitude?.value);
        }
        if (this.datetime?.dirty || this.time?.dirty) {
          const date = new Date(
            this.datetime?.value.year,
            this.datetime?.value.month - 1,
            this.datetime?.value.day,
            this.time?.value.hour,
            this.time?.value.minute,
            this.time?.value.second
          );
          metadataDto.datetime = date;
        }
        if (this.tags?.dirty) {
          metadataDto.tags = this.tags?.value.trim().split(',').map((tag: string) => tag.trim());
        }

        const updateSensorData = new CreateSensorDataDto(
          this.newPicture?.dirty ? this.newPicture?.value : undefined,
          Object.values(dirtyValues).length ? metadataDto : undefined
        );

        this.sensorDataService.updateSensorData(this.displayedMetaData.id, updateSensorData);
        this.close();
      }

    } else {
      throw new Error('Form is not valid!\nNice try!');
    }
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

  get newPicture(): AbstractControl | null {
    return this.sensorDataForm.get('newPicture');
  }

  clearPicture() {
    this.newPicture?.patchValue(undefined);
  }

  getDirtyValues(form: FormGroup): {[key: string]: any} {
    const dirtyValues: {[key: string]: any} = {};

    Object.keys(form.controls)
        .forEach(key => {
            const currentControl = form.controls[key];

            if (currentControl.dirty) {
              dirtyValues[key] = currentControl.value;
            }
        });

    return dirtyValues;
  }
}
