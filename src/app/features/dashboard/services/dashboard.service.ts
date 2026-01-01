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
        return of([
            { id: 'a1', type: 'DECISION', title: 'Pivot to B2B for EcoTrack', date: new Date('2025-12-28'), projectId: 'p3', projectName: 'EcoTrack' },
            { id: 'a2', type: 'MILESTONE', title: 'Identity Module Completed', date: new Date('2025-12-30'), projectId: 'p1', projectName: 'Personal OS' },
            { id: 'a3', type: 'PROJECT_START', title: 'Dating Platform Kickoff', date: new Date('2025-12-29'), projectId: 'p2', projectName: 'Dating Platform' },
            { id: 'a4', type: 'GOAL_REACHED', title: 'Read 20 Books', date: new Date('2025-11-15') }
        ]);
    }

    getFinancialSnapshot(): Observable<any> {
        return of({
            monthlyRevenue: [4000, 5500, 7200, 8900, 10500, 12500],
            months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        });
    }
}
