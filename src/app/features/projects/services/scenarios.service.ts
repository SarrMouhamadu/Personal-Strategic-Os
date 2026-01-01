import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Scenario } from '../../../core/models/scenario.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ScenariosService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = 'http://localhost:3000/api/scenarios';

    getScenariosByProject(projectId: string): Observable<Scenario[]> {
        return this.http.get<Scenario[]>(`${this.apiUrl}/project/${projectId}`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            catchError(err => {
                console.error('Error fetching scenarios', err);
                return of([]);
            })
        );
    }

    createScenario(scenario: Partial<Scenario>): Observable<Scenario> {
        return this.http.post<Scenario>(this.apiUrl, scenario, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    deleteScenario(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }
}
