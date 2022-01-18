import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SensorDataDto } from 'src/app/dtos/SensorData.dto';
import { SensorDataService } from 'src/app/services/sensorData.service';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: []
})
export class OverviewComponent implements OnInit {
  data: SensorDataDto[];

  constructor(
    private readonly sensorDataService: SensorDataService,
    private readonly modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.sensorDataService.sensorData$.subscribe(
      (sensorData) => (this.data = sensorData)
    );
  }

  open(id: string) {
    const displayedMetaData =
      this.sensorDataService.getSensorData(id) ?? SensorDataDto.newEmpty();

    const modalRef = this.modalService.open(DetailsComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl'
    });
    modalRef.componentInstance.displayedMetaData = displayedMetaData;
    modalRef.componentInstance.closeModal.subscribe(() => modalRef.close());
  }

  delete(id: string) {
    this.sensorDataService.deleteSensorData(id);
  }
}
