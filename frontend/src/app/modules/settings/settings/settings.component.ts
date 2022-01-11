import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PictureService } from 'src/app/services/picture.service';
import { SensorDataService } from 'src/app/services/sensorData.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: []
})
export class SettingsComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  points: number;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly sensorDataService: SensorDataService,
    private readonly pictureService: PictureService
  ) {}

  ngOnInit(): void {
    this.points = this.settingsService.maxNumberOfPoints;
  }

  close() {
    this.closeModal.emit();
  }

  clearCache() {
    console.log('Clearing cache');
    this.sensorDataService.resetCache();
    this.pictureService.resetCache();
  }

  pointsChanged(event: Event) {
    this.settingsService.maxNumberOfPoints = Number(
      (event.target as HTMLInputElement)?.value ??
        this.settingsService.maxNumberOfPoints
    );
  }
}
