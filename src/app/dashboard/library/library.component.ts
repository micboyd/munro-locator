import { Component, OnInit } from '@angular/core';

import { LibraryService } from './library.service';
import { Mountain } from '../../shared/models/Mountains/Mountain';

type CategorySummary = {
    key: string;        // raw category key from API
    label: string;      // display label
    count: number;
};

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    providers: [LibraryService],
    standalone: false,
})
export class LibraryComponent implements OnInit {
    mountains: Mountain[] = [];

    loading = false;
    error: string | null = null;

    selectedCategory: string | null = null;

    constructor(private mountainService: LibraryService) { }

    ngOnInit(): void {
        this.fetchMountains();
    }

    fetchMountains(): void {
        this.loading = true;
        this.error = null;

        this.mountainService.getAll().subscribe({
            next: (data) => {
                this.mountains = data ?? [];

                const first = this.categories[0]?.key ?? null;
                this.selectedCategory = first;

                this.loading = false;
            },
            error: (err) => {
                this.error =
                    err?.status === 404
                        ? 'No mountains found.'
                        : 'Failed to load mountains.';
                this.loading = false;
            },
        });
    }

    get totalCount(): number {
        return this.mountains.length;
    }

    get categories(): CategorySummary[] {
        const map = new Map<string, number>();

        for (const m of this.mountains) {
            const key = (m.category ?? 'Uncategorized').trim() || 'Uncategorized';
            map.set(key, (map.get(key) ?? 0) + 1);
        }

        return Array.from(map.entries())
            .map(([key, count]) => ({
                key,
                label: this.prettyCategory(key),
                count,
            }))
            .sort((a, b) => b.count - a.count);
    }

    get selectedCategoryLabel(): string {
        if (!this.selectedCategory) return 'All';
        return this.prettyCategory(this.selectedCategory);
    }

    get selectedMountains(): Mountain[] {
        if (!this.selectedCategory) return this.mountains;

        const cat = this.selectedCategory;
        return this.mountains.filter((m) => (m.category ?? 'Uncategorized') === cat);
    }

    selectCategory(key: string): void {
        this.selectedCategory = key;
    }

    private prettyCategory(key: string): string {
        // make "munro" => "Munro", "munros" => "Munros"
        const normalized = (key ?? '').trim();
        if (!normalized) return 'Uncategorized';
        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    }

    formatHeight(height?: number): string {
        if (height === null || height === undefined) return '—';
        return `${height.toLocaleString()}m`;
    }

    formatCoords(lat?: number, lng?: number): string {
        if (lat === null || lat === undefined || lng === null || lng === undefined) return '—';
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    imageOrFallback(url?: string): string {
        return (
            url?.trim() ||
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
        );
    }

    trackByName(_index: number, item: Mountain): string {
        return item.name ?? `${_index}`;
    }
}
