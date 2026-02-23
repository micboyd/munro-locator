import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from '../../models/Shared/PaginatedCollection';

type PageItem = number | 'dots';

@Component({
    selector: 'app-pager',
    templateUrl: './pager.component.html',
    standalone: false,
})
export class PagerComponent {
    @Input() pagination!: Pagination;

    @Output() pageChange = new EventEmitter<number>();

    goTo(page: number) {
        if (!this.pagination) return;

        const clamped = Math.max(1, Math.min(page, this.pagination.totalPages));
        if (clamped === this.pagination.page) return;

        this.pageChange.emit(clamped);
    }

    prev() {
        if (!this.pagination?.hasPrevPage) return;
        this.goTo(this.pagination.page - 1);
    }

    next() {
        if (!this.pagination?.hasNextPage) return;
        this.goTo(this.pagination.page + 1);
    }

    // Simple pager window with first/last and dots when needed
    get items(): PageItem[] {
        const p = this.pagination;
        if (!p || p.totalPages <= 1) return [];

        const total = p.totalPages;
        const current = p.page;
        const windowSize = 3; // pages around current

        const start = Math.max(2, current - windowSize);
        const end = Math.min(total - 1, current + windowSize);

        const out: PageItem[] = [1];

        if (start > 2) out.push('dots');

        for (let i = start; i <= end; i++) out.push(i);

        if (end < total - 1) out.push('dots');

        if (total > 1) out.push(total);

        // If total is small, just show all
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        return out;
    }
}