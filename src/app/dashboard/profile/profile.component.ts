import { Component, OnInit } from '@angular/core';

import { ProfileService } from './profile.service';
import { ProfileStats } from '../../shared/models/Profile/ProfileStats';
import { RecentActivity } from '../../shared/models/Profile/RecentActivity';
import { UserProfile } from '../../shared/models/Profile/UserProfile';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    standalone: false,
})
export class ProfileComponent implements OnInit {

    editMode: boolean = false;
    loading: boolean = true;
    loadError: boolean = false;
    recentActivities: RecentActivity[] = [];
    stats: ProfileStats | null = null;

    private _selectedUserProfile: UserProfile = null;

    get selectedUserProfile() {
        return this._selectedUserProfile;
    }

    constructor(private profileService: ProfileService) {}

    ngOnInit(): void {
        this.getUserProfile();
        this.getRecentActivities();
        this.getStats();
    }

    enableEditMode() {
        this.editMode = true;
    }

    closeEditMode() {
        this.editMode = false;
    }

    getUserProfile() {
        this.loading = true;
        this.loadError = false;
        this.profileService.getProfileByUserId().subscribe({
            next: (response) => {
                this._selectedUserProfile = response;
                this.editMode = false;
                this.loading = false;
            },
            error: (error) => {
                if (error.status === 404) {
                    this._selectedUserProfile = new UserProfile();
                    this.editMode = true;
                } else {
                    this.loadError = true;
                }
                this.loading = false;
            }
        });
    }

    getRecentActivities() {
        this.profileService.getRecentActivities(5).subscribe({
            next: (activities) => {
                this.recentActivities = activities;
            },
            error: () => {}
        });
    }

    getStats() {
        this.profileService.getStatsByUserId().subscribe({
            next: (stats) => {
                this.stats = stats;
            },
            error: () => {}
        });
    }

    formatElevation(metres: number): string {
        if (metres == null) return '0';
        if (metres >= 1000) return `${(metres / 1000).toFixed(1).replace(/\.0$/, '')}k`;
        return metres.toString();
    }

    getActivityIcon(type: string): string {
        if (type === 'completed') return 'fa-circle-check';
        if (type === 'trip_created') return 'fa-route';
        return 'fa-calendar-day';
    }

    getActivityLabel(activity: RecentActivity): string {
        if (activity.type === 'trip_created') return `Created: ${activity.title ?? 'Trip'}`;
        const prefix = activity.type === 'completed' ? 'Completed' : 'Planned';
        return `${prefix}: ${activity.mountain?.name}`;
    }

    getActivitySubtitle(activity: RecentActivity): string {
        if (activity.type === 'trip_created') return this.formatRelativeDate(activity.createdAt);
        const region = activity.mountain?.region ?? '';
        if (activity.type === 'completed') {
            return region ? `${region} • ${this.formatRelativeDate(activity.createdAt)}` : this.formatRelativeDate(activity.createdAt);
        }
        const date = activity.plannedDate ? this.formatDate(activity.plannedDate) : 'Date TBC';
        return region ? `${region} • ${date}` : date;
    }

    getActivityBadge(activity: RecentActivity): string {
        if (activity.type === 'completed') return activity.rating != null ? activity.rating.toString() : '-';
        if (activity.type === 'trip_created') return 'Trip';
        return activity.plannedDate ? this.getDayAbbrev(activity.plannedDate) : '-';
    }

    private formatRelativeDate(dateStr: string): string {
        const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }

    private formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }

    private getDayAbbrev(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short' });
    }
}
