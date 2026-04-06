import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CompletedMountain } from '../../shared/models/Mountains/CompletedMountain';
import { CompletedMountainsService } from '../../shared/services/completed-mountains.service';
import { PlannedMountain } from '../../shared/models/Mountains/PlannedMountain';
import { PlannedMountainsService } from '../../shared/services/planned-mountains.service';
import { TripPlan } from '../../shared/models/TripPlan/TripPlan';
import { TripPlansService } from '../../shared/services/trip-plans.service';

interface CalendarEvent {
    type: 'planned' | 'completed';
    name: string;
    id: string;
}

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    planned: PlannedMountain[];
    completed: CompletedMountain[];
}

interface TripSegment {
    trip: TripPlan;
    colStart: number;  // 1–7, CSS grid-column start line
    colEnd: number;    // 2–8, CSS grid-column end line (exclusive)
    isStart: boolean;  // trip actually starts this week
    isEnd: boolean;    // trip actually ends this week
    rowIndex: number;  // stacking row within the week's trip banner
}

interface WeekRow {
    days: CalendarDay[];
    tripSegments: TripSegment[];
    tripRowCount: number;
}

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    standalone: false,
})
export class CalendarComponent implements OnInit {

    loading = true;
    viewDate = new Date();
    weekRows: WeekRow[] = [];

    readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    private _planned: PlannedMountain[] = [];
    private _completed: CompletedMountain[] = [];
    private _trips: TripPlan[] = [];
    private _plannedByDate = new Map<string, PlannedMountain[]>();
    private _completedByDate = new Map<string, CompletedMountain[]>();

    constructor(
        private plannedService: PlannedMountainsService,
        private completedService: CompletedMountainsService,
        private tripService: TripPlansService,
    ) {
        this.viewDate = new Date();
        this.viewDate.setDate(1);
    }

    get monthLabel(): string {
        return this.viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    }

    get allDays(): CalendarDay[] {
        return this.weekRows.flatMap(w => w.days);
    }

    get mobileDays(): CalendarDay[] {
        return this.allDays.filter(d => d.isCurrentMonth);
    }

    get totalPlannedThisMonth(): number {
        return this.allDays.reduce((sum, d) => sum + d.planned.length, 0);
    }

    get totalCompletedThisMonth(): number {
        return this.allDays.reduce((sum, d) => sum + d.completed.length, 0);
    }

    get totalTripsThisMonth(): number {
        const month = this.viewDate.getMonth();
        const year = this.viewDate.getFullYear();
        const monthStart = this.startOfDay(new Date(year, month, 1));
        const monthEnd = this.startOfDay(new Date(year, month + 1, 0));
        return this._trips.filter(t => {
            if (!t.startDate && !t.endDate) return false;
            const s = this.startOfDay(t.startDate ?? t.endDate!);
            const e = this.startOfDay(t.endDate ?? t.startDate!);
            return s <= monthEnd && e >= monthStart;
        }).length;
    }

    ngOnInit(): void {
        this.buildCalendar();

        forkJoin({
            planned: this.plannedService.getPlannedMountainsForCurrentUser('date_asc'),
            completed: this.completedService.getCompletedMountainsForCurrentUser('date_asc'),
            trips: this.tripService.getAll(),
        })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(({ planned, completed, trips }) => {
                this._planned = planned;
                this._completed = completed;
                this._trips = trips;
                this.buildIndexes();
                this.buildCalendar();
            });
    }

    prevMonth(): void {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
        this.buildCalendar();
    }

    nextMonth(): void {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
        this.buildCalendar();
    }

    goToToday(): void {
        this.viewDate = new Date();
        this.viewDate.setDate(1);
        this.buildCalendar();
    }

    visibleEvents(day: CalendarDay): CalendarEvent[] {
        const events: CalendarEvent[] = [];
        for (const pm of day.planned) {
            events.push({ type: 'planned', name: pm.mountain?.name ?? '', id: pm._id });
        }
        for (const cm of day.completed) {
            events.push({ type: 'completed', name: cm.mountain?.name ?? '', id: cm._id });
        }
        return events.slice(0, 3);
    }

    tripsForDay(day: CalendarDay): TripPlan[] {
        const d = this.startOfDay(day.date);
        return this._trips.filter(t => {
            if (!t.startDate && !t.endDate) return false;
            const s = this.startOfDay(t.startDate ?? t.endDate!);
            const e = this.startOfDay(t.endDate   ?? t.startDate!);
            return d >= s && d <= e;
        });
    }

    overflowCount(day: CalendarDay): number {
        return Math.max(0, day.planned.length + day.completed.length - 3);
    }

    tripBannerHeight(week: WeekRow): string {
        return `${week.tripRowCount * 26 + 8}px`;
    }

    tripSegmentStyle(seg: TripSegment): { [key: string]: string } {
        return {
            'grid-column': `${seg.colStart} / ${seg.colEnd}`,
            'grid-row': `${seg.rowIndex + 1}`,
        };
    }

    tripBarClass(seg: TripSegment): string {
        const base = 'flex h-5 items-center overflow-hidden bg-[#4A7FC1] text-white';
        const roundL = seg.isStart ? 'rounded-l-full ml-1' : '';
        const roundR = seg.isEnd   ? 'rounded-r-full mr-1' : '';
        return `${base} ${roundL} ${roundR}`;
    }

    private dateKey(date: Date): string {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    private startOfDay(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    private buildIndexes(): void {
        this._plannedByDate.clear();
        this._completedByDate.clear();

        for (const pm of this._planned) {
            const key = this.dateKey(new Date(pm.plannedDate));
            if (!this._plannedByDate.has(key)) this._plannedByDate.set(key, []);
            this._plannedByDate.get(key)!.push(pm);
        }

        for (const cm of this._completed) {
            const key = this.dateKey(new Date(cm.dateCompleted));
            if (!this._completedByDate.has(key)) this._completedByDate.set(key, []);
            this._completedByDate.get(key)!.push(cm);
        }
    }

    private buildCalendar(): void {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();
        const today = new Date();

        const firstDow = new Date(year, month, 1).getDay();
        const leadDays = firstDow === 0 ? 6 : firstDow - 1;
        const startDate = new Date(year, month, 1 - leadDays);

        const days: CalendarDay[] = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
            const key = this.dateKey(date);
            days.push({
                date,
                isCurrentMonth: date.getMonth() === month,
                isToday: date.toDateString() === today.toDateString(),
                planned: this._plannedByDate.get(key) ?? [],
                completed: this._completedByDate.get(key) ?? [],
            });
        }

        this.weekRows = [];
        for (let w = 0; w < 6; w++) {
            const weekDays = days.slice(w * 7, w * 7 + 7);
            const segments = this.computeTripSegments(weekDays);
            this.assignTripRows(segments);
            this.weekRows.push({
                days: weekDays,
                tripSegments: segments,
                tripRowCount: segments.length > 0 ? Math.max(...segments.map(s => s.rowIndex)) + 1 : 0,
            });
        }
    }

    private computeTripSegments(weekDays: CalendarDay[]): TripSegment[] {
        const segments: TripSegment[] = [];
        const weekKeys = weekDays.map(d => this.dateKey(d.date));
        const weekStart = this.startOfDay(weekDays[0].date);
        const weekEnd   = this.startOfDay(weekDays[6].date);

        for (const trip of this._trips) {
            if (!trip.startDate && !trip.endDate) continue;

            const tripStart = this.startOfDay(trip.startDate ?? trip.endDate!);
            const tripEnd   = this.startOfDay(trip.endDate   ?? trip.startDate!);

            if (tripEnd < weekStart || tripStart > weekEnd) continue;

            const segStart = tripStart < weekStart ? weekStart : tripStart;
            const segEnd   = tripEnd   > weekEnd   ? weekEnd   : tripEnd;

            const colStartIdx = weekKeys.indexOf(this.dateKey(segStart));
            const colEndIdx   = weekKeys.indexOf(this.dateKey(segEnd));

            segments.push({
                trip,
                colStart: (colStartIdx >= 0 ? colStartIdx : 0) + 1,
                colEnd:   (colEndIdx   >= 0 ? colEndIdx   : 6) + 2,
                isStart: tripStart >= weekStart && tripStart <= weekEnd,
                isEnd:   tripEnd   >= weekStart && tripEnd   <= weekEnd,
                rowIndex: 0,
            });
        }

        return segments;
    }

    private assignTripRows(segments: TripSegment[]): void {
        segments.sort((a, b) => a.colStart - b.colStart);
        const rowEnds: number[] = [];

        for (const seg of segments) {
            let placed = false;
            for (let r = 0; r < rowEnds.length; r++) {
                if (seg.colStart >= rowEnds[r]) {
                    seg.rowIndex = r;
                    rowEnds[r] = seg.colEnd;
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                seg.rowIndex = rowEnds.length;
                rowEnds.push(seg.colEnd);
            }
        }
    }
}
