import { Component, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface PickerDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean; // single mode only
}

export type DateRangeValue = { start: string; end: string };

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    standalone: false,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true,
        },
    ],
})
export class DatePickerComponent implements ControlValueAccessor {

    @Input() mode: 'single' | 'range' = 'single';
    @Input() placeholder    = 'Select a date';
    @Input() placeholderStart = 'Start date';
    @Input() placeholderEnd   = 'End date';

    isOpen     = false;
    isDisabled = false;
    viewDate   = new Date();
    calendarDays: PickerDay[] = [];

    // Single mode
    selectedDate: Date | null = null;

    // Range mode
    rangeStart:     Date | null   = null;
    rangeEnd:       Date | null   = null;
    rangeSelecting: 'start' | 'end' = 'start';
    hoverDate:      Date | null   = null;

    readonly weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    private onChange: (value: any) => void = () => {};
    private onTouched: () => void = () => {};

    constructor(private el: ElementRef) {}

    // Close when clicking outside — do NOT stop propagation on the trigger so
    // this fires correctly when switching between multiple pickers on the page.
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.el.nativeElement.contains(event.target)) {
            this.close();
        }
    }

    // ── Getters ──────────────────────────────────────────────────────────────

    get isRangeMode(): boolean { return this.mode === 'range'; }

    get monthLabel(): string {
        return this.viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    }

    get hasValue(): boolean {
        return this.isRangeMode
            ? !!(this.rangeStart || this.rangeEnd)
            : !!this.selectedDate;
    }

    get triggerLabel(): string {
        if (this.isRangeMode) {
            if (!this.rangeStart && !this.rangeEnd) return '';
            const s = this.rangeStart ? this.formatShort(this.rangeStart) : '…';
            const e = this.rangeEnd   ? this.formatShort(this.rangeEnd)   : '…';
            return `${s} → ${e}`;
        }
        return this.selectedDate ? this.formatLong(this.selectedDate) : '';
    }

    get rangeHint(): string {
        if (!this.isRangeMode) return '';
        if (this.rangeSelecting === 'start') return 'Select start date';
        return this.rangeStart
            ? `From ${this.formatShort(this.rangeStart)} — select end date`
            : 'Select end date';
    }

    // Effective visual range bounds (accounts for hover preview + reversed drag)
    private get visualStart(): Date | null {
        if (!this.rangeStart) return null;
        const end = this.rangeEnd ?? (this.rangeSelecting === 'end' ? this.hoverDate : null);
        if (!end) return this.rangeStart;
        return this.rangeStart <= end ? this.rangeStart : end;
    }

    private get visualEnd(): Date | null {
        if (!this.rangeStart) return null;
        const end = this.rangeEnd ?? (this.rangeSelecting === 'end' ? this.hoverDate : null);
        if (!end) return null;
        return this.rangeStart <= end ? end : this.rangeStart;
    }

    // ── ControlValueAccessor ─────────────────────────────────────────────────

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writeValue(value: any): void {
        if (this.isRangeMode) {
            const v = value as DateRangeValue | null;
            this.rangeStart = v?.start ? new Date(`${v.start}T00:00:00`) : null;
            this.rangeEnd   = v?.end   ? new Date(`${v.end}T00:00:00`)   : null;
            this.rangeSelecting = this.rangeStart && !this.rangeEnd ? 'end' : 'start';
        } else {
            const s = value as string | null;
            this.selectedDate = s ? new Date(`${s}T00:00:00`) : null;
        }
        this.buildCalendar();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerOnChange(fn: (v: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void       { this.onTouched = fn; }
    setDisabledState(d: boolean): void             { this.isDisabled = d; }

    // ── Picker controls ───────────────────────────────────────────────────────

    toggle(): void {
        if (this.isDisabled) return;
        this.isOpen ? this.close() : this.open();
    }

    prevMonth(event: Event): void {
        event.stopPropagation();
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
        this.buildCalendar();
    }

    nextMonth(event: Event): void {
        event.stopPropagation();
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
        this.buildCalendar();
    }

    selectDate(event: Event, day: PickerDay): void {
        event.stopPropagation();

        if (this.isRangeMode) {
            if (this.rangeSelecting === 'start') {
                this.rangeStart = day.date;
                this.rangeEnd   = null;
                this.rangeSelecting = 'end';
            } else {
                if (day.date >= this.rangeStart!) {
                    this.rangeEnd = day.date;
                    this.emitRange();
                    this.close();
                } else {
                    // Clicked before start — treat as new start
                    this.rangeStart = day.date;
                    this.rangeEnd   = null;
                }
            }
        } else {
            this.selectedDate = day.date;
            this.onChange(this.toISO(day.date));
            this.onTouched();
            this.close();
        }

        this.buildCalendar();
    }

    onDayHover(day: PickerDay): void {
        if (this.isRangeMode && this.rangeSelecting === 'end') {
            this.hoverDate = day.date;
        }
    }

    onCalendarLeave(): void {
        this.hoverDate = null;
    }

    clearValue(event: Event): void {
        event.stopPropagation();
        if (this.isRangeMode) {
            this.rangeStart = this.rangeEnd = null;
            this.rangeSelecting = 'start';
            this.emitRange();
        } else {
            this.selectedDate = null;
            this.onChange('');
        }
        this.buildCalendar();
    }

    // ── Range day helpers (used in template) ─────────────────────────────────

    isInRangeDay(day: PickerDay): boolean {
        const s = this.visualStart, e = this.visualEnd;
        if (!s || !e) return false;
        return day.date >= s && day.date <= e;
    }

    isVisualStart(day: PickerDay): boolean {
        const s = this.visualStart;
        return !!s && day.date.toDateString() === s.toDateString();
    }

    isVisualEnd(day: PickerDay): boolean {
        const e = this.visualEnd;
        return !!e && day.date.toDateString() === e.toDateString();
    }

    showLeftBg(day: PickerDay): boolean {
        return this.isInRangeDay(day) && !this.isVisualStart(day);
    }

    showRightBg(day: PickerDay): boolean {
        return this.isInRangeDay(day) && !this.isVisualEnd(day);
    }

    dayClass(day: PickerDay): string {
        const base = 'relative z-10 grid h-8 w-8 place-items-center rounded-full text-xs transition-colors duration-100 ';

        if (!this.isRangeMode) {
            if (day.isSelected)      return base + 'bg-neutral-950 font-bold text-white';
            if (day.isToday)         return base + 'border-2 border-neutral-950 font-bold text-neutral-900 hover:bg-neutral-100';
            if (day.isCurrentMonth)  return base + 'font-medium text-neutral-700 hover:bg-neutral-100';
            return base + 'font-normal text-neutral-300 hover:bg-neutral-50';
        }

        const start = this.isVisualStart(day);
        const end   = this.isVisualEnd(day);
        const inRange = this.isInRangeDay(day);

        if (start || end)           return base + 'bg-neutral-950 font-bold text-white';
        if (day.isToday && !inRange) return base + 'border-2 border-neutral-950 font-bold text-neutral-900 hover:bg-neutral-200';
        if (inRange)                return base + (day.isCurrentMonth ? 'font-medium text-neutral-900 hover:bg-neutral-200' : 'font-normal text-neutral-500');
        if (day.isCurrentMonth)     return base + 'font-medium text-neutral-700 hover:bg-neutral-100';
        return base + 'font-normal text-neutral-300 hover:bg-neutral-50';
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private open(): void {
        const base = (this.isRangeMode ? this.rangeStart : this.selectedDate) ?? new Date();
        this.viewDate = new Date(base.getFullYear(), base.getMonth(), 1);
        this.hoverDate = null;
        this.rangeSelecting = this.isRangeMode && this.rangeStart && !this.rangeEnd ? 'end' : 'start';
        this.buildCalendar();
        this.isOpen = true;
    }

    private close(): void {
        this.isOpen = false;
        this.hoverDate = null;
        this.onTouched();
    }

    private emitRange(): void {
        this.onChange({
            start: this.rangeStart ? this.toISO(this.rangeStart) : '',
            end:   this.rangeEnd   ? this.toISO(this.rangeEnd)   : '',
        } as DateRangeValue);
    }

    private toISO(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    private formatShort(date: Date): string {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    private formatLong(date: Date): string {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    private buildCalendar(): void {
        const year  = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();
        const today = new Date();

        const firstDow = new Date(year, month, 1).getDay();
        const leadDays = firstDow === 0 ? 6 : firstDow - 1;
        const startDate = new Date(year, month, 1 - leadDays);

        this.calendarDays = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
            this.calendarDays.push({
                date,
                isCurrentMonth: date.getMonth() === month,
                isToday:        date.toDateString() === today.toDateString(),
                isSelected:     !this.isRangeMode && !!this.selectedDate
                                    && date.toDateString() === this.selectedDate.toDateString(),
            });
        }
    }
}
