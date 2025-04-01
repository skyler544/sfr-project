import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { EarthquakeService } from '../../services/earthquake.service';

@Component({
  selector: 'earthquake-filters',
  templateUrl: './earthquake-filters.component.html',
  styleUrls: ['./earthquake-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarthquakeFiltersComponent implements OnInit, OnDestroy {
  filters: any;
  availableContinents: string[] = [];
  private subscription = new Subscription();

  constructor(private earthquakeService: EarthquakeService) {}

  ngOnInit() {
    this.availableContinents = this.earthquakeService.getAvailableContinents();

    this.subscription.add(
      this.earthquakeService.filters$.subscribe((filters) => {
        this.filters = filters;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleNumberInput(event: Event, property: string) {
    const value = (event.target as HTMLInputElement).value;

    if (value === '') {
      this.earthquakeService.updateFilter(property, null);
    } else {
      const numberValue = Number(value);
      if (!isNaN(numberValue)) {
        this.earthquakeService.updateFilter(property, numberValue);
      }
    }
  }

  handleContinentChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.earthquakeService.updateFilter('selectedContinent', value);
  }

  onResetFilters() {
    this.earthquakeService.resetFilters();
  }
}
