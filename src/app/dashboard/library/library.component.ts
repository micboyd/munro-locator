import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LibraryService } from './library.service';
import { Mountain } from '../../shared/models/Mountains/Mountain';
import { debounceTime, distinctUntilChanged } from 'rxjs';

type CategorySummary = {
    key: string;
    label: string;
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

    // 🔹 Global search (Reactive)
    globalSearch = new FormControl<string>('', { nonNullable: true });

    constructor(private mountainService: LibraryService) { }

    ngOnInit(): void {
        this.fetchMountains(null, null);

        this.globalSearch.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe((value) => {
                this.onGlobalSearch(value);
            });
    }

    fetchMountains(category?: string | null, searchString?: string | null): void {
        this.loading = true;
        this.error = null;

        const params: any = {};

        if (category) {
            params.category = category;
        }

        if (searchString) {
            params.search = searchString;
        }

        this.mountainService.getAll(params).subscribe({
            next: (data) => {
                this.mountains = data ?? [];

                // ✅ keep current selection if it still exists; otherwise pick the first category
                const cats = this.categories;
                const first = cats[0]?.key ?? null;

                if (!this.selectedCategory || !cats.some((c) => c.key === this.selectedCategory)) {
                    this.selectedCategory = first;
                }

                this.loading = false;
            },
            error: (err) => {
                this.error =
                    err?.status === 404 ? 'No mountains found.' : 'Failed to load mountains.';
                this.loading = false;
            },
        });
    }

    onGlobalSearch(value: string): void {
        this.fetchMountains(null, value);
    }

    clearGlobalSearch(): void {
        this.globalSearch.setValue('');
    }

    get totalCount(): number {
        return this.mountains.length;
    }

    // ✅ category is now string[]; a mountain with multiple categories counts toward each
    get categories(): CategorySummary[] {
        const map = new Map<string, number>();

        for (const m of this.mountains) {
            const rawCats = Array.isArray(m.category) ? m.category : [];

            // normalize + de-dupe per mountain
            const cats = [
                ...new Set(
                    rawCats
                        .map((c) => (c ?? '').trim())
                        .filter(Boolean)
                ),
            ];

            // fallback
            if (cats.length === 0) cats.push('Uncategorized');

            for (const key of cats) {
                map.set(key, (map.get(key) ?? 0) + 1);
            }
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

    // ✅ a mountain appears in a category if its category[] includes it
    // ✅ empty category[] maps to "Uncategorized"
    get selectedMountains(): Mountain[] {
        if (!this.selectedCategory) return this.mountains;

        const cat = this.selectedCategory;

        return this.mountains.filter((m) => {
            const rawCats = Array.isArray(m.category) ? m.category : [];
            const cats = rawCats.map((c) => (c ?? '').trim()).filter(Boolean);

            if (cats.length === 0) return cat === 'Uncategorized';
            return cats.includes(cat);
        });
    }

    selectCategory(key: string): void {
        this.selectedCategory = key;
    }

    prettyCategory(key: string): string {
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

    trackByName(index: number, item: Mountain): string {
        return item.name ?? `${index}`;
    }
}