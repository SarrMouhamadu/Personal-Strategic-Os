import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface AnnualSummary {
    year: string;
    projects: {
        total: number;
        activeCount: number;
        statusDistribution: { [key: string]: number };
    };
    impact: { [key: string]: number | string };
    goals: {
        total: number;
        completed: number;
        completionRate: number;
    };
    decisions: {
        totalCount: number;
        latest: any[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = 'http://localhost:3000/api/analytics';

    getAnnualSummary(): Observable<AnnualSummary | undefined> {
        return this.http.get<AnnualSummary>(`${this.apiUrl}/annual-summary`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            catchError((err: any) => {
                console.error('Error fetching annual summary', err);
                return of(undefined);
            })
        );
    }
}
