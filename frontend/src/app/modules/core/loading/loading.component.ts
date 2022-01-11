import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  showLoading: boolean;

  constructor(
    private readonly loadingService: LoadingService,
    private readonly cb: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingService.loadingStatus$.subscribe((status) => {
      this.showLoading = status;
      this.cb.detectChanges();
    });
  }
}
