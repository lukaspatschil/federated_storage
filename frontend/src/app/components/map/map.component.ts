import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ElementRef
} from '@angular/core';
import { Map, Feature } from 'ol';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import * as geom from 'ol/geom';
import * as proj from 'ol/proj';
import * as style from 'ol/style';
import { SensorDataService } from 'src/app/services/sensorData.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailsComponent } from '../details/details.component';
import { SensorDataDto } from 'src/app/dtos/SensorData.dto';
import { combineLatest } from 'rxjs';
import { isEmpty } from 'ol/extent';
import { SettingsService } from 'src/app/modules/settings/settings.service';

@Component({
  selector: 'app-map',
  template: '',
  styles: [':host { width: 100%; height: 100%; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {
  @Input()
  map!: Map;

  private points: layer.Vector<source.Vector<geom.Geometry>>;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly sensorDataService: SensorDataService,
    private readonly settingsService: SettingsService,
    private readonly modalService: NgbModal
  ) {}

  ngOnInit() {
    this.points = this.newLayer();

    this.map.addLayer(this.points);

    this.map.setTarget(this.elementRef.nativeElement as HTMLElement);

    combineLatest([
      this.sensorDataService.sensorData$,
      this.settingsService.maxNumberOfPoints$
    ]).subscribe(([data, maxNumberOfPoints]) => {
      this.map.removeLayer(this.points);
      this.points = this.newLayer();
      data
        .slice(0, maxNumberOfPoints)
        .forEach((entry) =>
          this.addPoint(
            entry.id,
            entry.metadata.location.longitude,
            entry.metadata.location.latitude
          )
        );
      this.map.addLayer(this.points);
      if (!isEmpty(this.points.getSource().getExtent())) {
        this.map.getView().fit(this.points.getSource().getExtent());
      }
    });

    this.map.on('singleclick', (event) => {
      const metadata = this.map.getFeaturesAtPixel(event.pixel, {
        layerFilter: (layer) => layer === this.points
      });

      if (metadata[0]?.get('name')) {
        this.open(String(metadata[0].get('name')));
      }
    });
  }

  private open(id: string) {
    const displayedMetaData =
      this.sensorDataService.getSensorData(id) ?? SensorDataDto.newEmpty();

    const modalRef = this.modalService.open(DetailsComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl'
    });
    modalRef.componentInstance.displayedMetaData = displayedMetaData;
    modalRef.componentInstance.closeModal.subscribe(() => modalRef.close());
  }

  private addPoint(id: string, longitude: number, latitude: number): void {
    this.points.getSource().addFeature(
      new Feature({
        geometry: new geom.Point(proj.fromLonLat([longitude, latitude])),
        name: id
      })
    );
  }

  private newLayer(): layer.Vector<source.Vector<geom.Geometry>> {
    return new layer.Vector({
      source: new source.Vector({
        features: []
      }),
      style: new style.Style({
        image: new style.Circle({
          radius: 7,
          fill: new style.Fill({ color: '#dc3545' }),
          stroke: new style.Stroke({ color: 'black', width: 1 })
        })
      })
    });
  }
}
