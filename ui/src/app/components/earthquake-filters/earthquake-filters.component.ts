import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EarthquakeService } from '@app/services/earthquake.service';
import { FilterCriteria } from '@app/models/filter-criteria';

@Component({
  selector: 'earthquake-filters',
  templateUrl: './earthquake-filters.component.html',
  styleUrls: ['./earthquake-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class EarthquakeFiltersComponent implements OnInit, OnDestroy {
  filters: FilterCriteria | null = null;
  availableContinents: string[] = [];
  private subscription = new Subscription();

  constructor(private earthquakeService: EarthquakeService) {}

  ngOnInit() {
    this.subscription.add(
      this.earthquakeService.earthquakes$.subscribe(() => {
        this.availableContinents =
          this.earthquakeService.getAvailableContinents();
      })
    );

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
