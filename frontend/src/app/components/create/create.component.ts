import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CreateSensorDataDto } from 'src/app/dtos/CreateSensorData.dto';
import { LocationDto } from 'src/app/dtos/Location.dto';
import { MetadataDto } from 'src/app/dtos/Metadata.dto';
import { SensorDataService } from 'src/app/services/sensorData.service';
import { requiredFileType } from 'src/app/validators/requiredFileType';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  sensorDataForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sensorDataService: SensorDataService
  ) {}

  ngOnInit(): void {
    this.sensorDataForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      placeIdent: ['', [Validators.required]],
      datetime: ['', [Validators.required]],
      time: ['', [Validators.required]],
      deviceID: ['', [Validators.required]],
      filename: ['', [Validators.required]],
      frameNum: ['', [Validators.required, Validators.min(0)]],
      seqID: ['', [Validators.required]],
      seqNumFrames: ['', [Validators.required, Validators.min(0)]],
      latitude: [
        '',
        [Validators.required, Validators.min(-90), Validators.max(90)]
      ],
      longitude: [
        '',
        [Validators.required, Validators.min(-180), Validators.max(180)]
      ],
      picture: [undefined, [Validators.required, requiredFileType()]]
    });
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

  get picture(): AbstractControl | null {
    return this.sensorDataForm.get('picture');
  }

  save() {
    console.log(this.sensorDataForm.value);
    if (this.sensorDataForm.valid) {
      const metadataDto = new MetadataDto(
        this.name?.value,
        this.placeIdent?.value,
        this.seqID?.value,
        new Date(
          this.datetime?.value.year,
          this.datetime?.value.month - 1,
          this.datetime?.value.day,
          this.time?.value.hour,
          this.time?.value.minute,
          this.time?.value.second,
          0
        ),
        this.frameNum?.value,
        this.seqNumFrames?.value,
        this.filename?.value,
        this.deviceID?.value,
        new LocationDto(this.latitude?.value, this.longitude?.value),
        []
      );
      const createSensorDataDto = new CreateSensorDataDto(
        this.picture?.value,
        metadataDto
      );

      this.sensorDataService
        .createSensorData(createSensorDataDto)
        .subscribe(() => {
          this.close();
        });
    }
  }

  close() {
    this.closeModal.emit();
  }

  clearPicture(): void {
    this.picture?.patchValue(undefined);
  }
}
