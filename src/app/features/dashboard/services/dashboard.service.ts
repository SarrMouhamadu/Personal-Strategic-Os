import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface DashboardStats {
    activeProjects: number;
    totalRevenue: number;
    averageImpact: number;
    goalsAchieved: number;
}

export interface ImpactDimension {
    label: string;
    value: number; // 0-10
    fullMark: number;
}

export interface Activity {
    id: string;
    type: 'MILESTONE' | 'DECISION' | 'PROJECT_START' | 'GOAL_REACHED';
    title: string;
    date: Date;
    projectId?: string;
    projectName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor() { }

    getGlobalStats(): Observable<DashboardStats> {
        // Mock data based on the current state of the "Empire"
        return of({
            activeProjects: 0,
            totalRevenue: 0,
            averageImpact: 0,
            goalsAchieved: 0
        });
    }

    getImpactRadarData(): Observable<ImpactDimension[]> {
        return of([
            { label: 'Personal', value: 9, fullMark: 10 },
            { label: 'Social', value: 7, fullMark: 10 },
            { label: 'Environmental', value: 5, fullMark: 10 },
            { label: 'Financial', value: 8, fullMark: 10 },
            { label: 'Institutional', value: 6, fullMark: 10 },
            { label: 'Network', value: 7, fullMark: 10 }
        ]);
    }

    getRecentActivity(): Observable<Activity[]> {
        return of([]);
    }

    getFinancialSnapshot(): Observable<any> {
        return of({
            monthlyRevenue: [4000, 5500, 7200, 8900, 10500, 12500],
            months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        });
    }
}
