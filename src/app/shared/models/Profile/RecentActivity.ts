export interface RecentActivityMountain {
    _id: string;
    name: string;
    region: string;
    height: number;
    category: string[];
}

export interface RecentActivity {
    _id: string;
    type: 'completed' | 'planned';
    createdAt: string;
    mountain: RecentActivityMountain;
    dateCompleted?: string;
    rating?: number;
    plannedDate?: string;
}

export interface RecentActivityResponse {
    data: RecentActivity[];
    total: number;
}
