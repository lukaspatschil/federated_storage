import { Component, OnInit } from '@angular/core';
import { View, Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { SensorDataService } from './services/sensorData.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './components/create/create.component';
import { SettingsComponent } from './modules/settings/settings/settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  map: Map;
  title = 'Federated Storage Infrastructure for IoT Sensor Data';
  cacheSize: number;

  constructor(
    private readonly sensorDataService: SensorDataService,
    private readonly modalService: NgbModal
  ) {}

  ngOnInit() {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 1
      })
    });

    this.sensorDataService.sensorData$.subscribe(
      (data) => (this.cacheSize = data.length)
    );
  }

  openSettings() {
    const modalRef = this.modalService.open(SettingsComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl'
    });
    modalRef.componentInstance.closeModal.subscribe(() => modalRef.close());
  }

  createSensorData() {
    const modalRef = this.modalService.open(CreateComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl'
    });
    modalRef.componentInstance.closeModal.subscribe(() => modalRef.close());
  }
}
