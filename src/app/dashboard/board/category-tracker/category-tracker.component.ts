import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CompletedMountainsService } from '../../../shared/services/completed-mountains.service';
import { LibraryService } from '../../library/library.service';

interface CategoryStat {
    name: string;
    total: number;
    completed: number;
    percentage: number;
    isComplete: boolean;
}

@Component({
    selector: 'app-category-tracker',
    templateUrl: './category-tracker.component.html',
    standalone: false,
    providers: [LibraryService],
})
export class CategoryTrackerComponent implements OnInit {

    stats: CategoryStat[] = [];
    loading = true;

    get completedCount(): number {
        return this.stats.filter(s => s.isComplete).length;
    }

    constructor(
        private libraryService: LibraryService,
        private completedService: CompletedMountainsService,
    ) {}

    ngOnInit(): void {
        forkJoin({
            categories: this.libraryService.getCategories(),
            completed:  this.completedService.getCompletedMountainsForCurrentUser(),
        })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(({ categories, completed }) => {
                // Count completions per category
                const countMap = new Map<string, number>();
                for (const cm of completed) {
                    for (const cat of cm.mountain?.category ?? []) {
                        countMap.set(cat, (countMap.get(cat) ?? 0) + 1);
                    }
                }

                this.stats = categories
                    .filter(c => c.count > 0)
                    .map(c => {
                        const done = countMap.get(c.name) ?? 0;
                        const pct  = c.count > 0 ? Math.round((done / c.count) * 100) : 0;
                        return {
                            name:       c.name,
                            total:      c.count,
                            completed:  done,
                            percentage: pct,
                            isComplete: done >= c.count,
                        };
                    })
                    .sort((a, b) => b.percentage - a.percentage);
            });
    }
}
