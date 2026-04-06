import { Component, OnInit } from '@angular/core';

import { PlannedMountain } from '../../shared/models/Mountains/PlannedMountain';
import { PlannedMountainsService } from '../../shared/services/planned-mountains.service';

@Component({
    selector: 'app-weather-page',
    templateUrl: './weather-page.component.html',
    standalone: false,
})
export class WeatherPageComponent implements OnInit {

    mountains: PlannedMountain[] = [];
    selected: PlannedMountain | null = null;
    loading = true;
    search = '';

    constructor(private plannedService: PlannedMountainsService) {}

    ngOnInit(): void {
        this.plannedService.getPlannedMountainsForCurrentUser('date_asc').subscribe({
            next: (mountains) => {
                this.mountains = mountains;
                if (mountains.length > 0) {
                    this.selected = mountains[0];
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    get filteredMountains(): PlannedMountain[] {
        if (!this.search.trim()) return this.mountains;
        const q = this.search.toLowerCase();
        return this.mountains.filter(m =>
            m.mountain.name.toLowerCase().includes(q) ||
            m.mountain.region?.toLowerCase().includes(q)
        );
    }

    select(mountain: PlannedMountain): void {
        this.selected = mountain;
    }

    isSelected(mountain: PlannedMountain): boolean {
        return !!this.selected && this.selected._id === mountain._id;
    }

    plannedDateLabel(date: Date): string {
        return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}
