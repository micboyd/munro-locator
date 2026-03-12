import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { CompletedMountain } from '../../../shared/models/Mountains/CompletedMountain';
import { CompletedMountainRequest } from '../../../shared/models/Mountains/CompletedMountainRequest';
import { CompletedMountainsService } from '../../../shared/services/completed-mountains.service';
import { Mountain } from '../../../shared/models/Mountains/Mountain';
import { PlannedMountain } from '../../../shared/models/Mountains/PlannedMountain';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-complete-mountain',
    templateUrl: './complete-mountain.component.html',
    standalone: false,
})
export class CompleteMountainComponent implements OnInit {
    @Input() plannedMountain?: PlannedMountain;
    @Input() existingRecord?: CompletedMountain;
    @Input() readonly = false;

    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<CompletedMountain>();

    form!: FormGroup;
    rating = 0;
    saving = false;
    selectedFiles: File[] = [];
    previewUrls: string[] = [];

    get isNew(): boolean {
        return !this.existingRecord;
    }

    get mountain(): Mountain | undefined {
        return this.plannedMountain?.mountain ?? this.existingRecord?.mountain;
    }

    get existingPhotoUrls(): string[] {
        return this.existingRecord?.summitPhotos ?? [];
    }

    constructor(
        private fb: FormBuilder,
        private completedMountainsService: CompletedMountainsService,
        private toastService: ToastService,
    ) {}

    ngOnInit(): void {
        const record = this.existingRecord ?? new CompletedMountain();
        this.form = record.createForm(this.fb);
        this.rating = record.rating ?? 0;

        if (this.readonly) {
            this.form.disable();
        }
    }

    onRatingChange(value: number): void {
        if (!this.readonly) this.rating = value;
    }

    onPhotosSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files = Array.from(input.files ?? []);

        for (const file of files) {
            this.selectedFiles.push(file);
            const reader = new FileReader();
            reader.onload = () => this.previewUrls.push(reader.result as string);
            reader.readAsDataURL(file);
        }

        input.value = '';
    }

    removePhoto(index: number): void {
        this.selectedFiles.splice(index, 1);
        this.previewUrls.splice(index, 1);
    }

    save(): void {
        if (this.form.invalid || this.saving || this.readonly) return;

        const request: CompletedMountainRequest = {
            mountainId: this.plannedMountain?.mountain._id ?? this.existingRecord?.mountainId,
            dateCompleted: new Date(this.form.value.dateCompleted),
            notes: this.form.value.notes ?? '',
            rating: this.rating,
            summitPhotos: this.selectedFiles,
        };

        console.log(this.form.value);
        console.log('CompletedMountainRequest:', request);

        this.saving = true;

        const call$ = this.isNew
            ? this.completedMountainsService.createCompletedMountain(request)
            : this.completedMountainsService.updateCompletedMountainById(this.existingRecord._id, request);

        call$
            .pipe(finalize(() => (this.saving = false)))
            .subscribe({
                next: (result) => {
                    this.toastService.show(`${this.mountain?.name} marked as completed!`);
                    this.saved.emit(result);
                    this.close.emit();
                },
                error: () => {
                    this.toastService.show('Something went wrong. Please try again.');
                },
            });
    }

    onClose(): void {
        this.close.emit();
    }
}
