import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Decision } from '../../../core/models/decision.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class DecisionsService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = 'http://localhost:3000/api/decisions';

    getDecisions(): Observable<Decision[]> {
        return this.http.get<Decision[]>(this.apiUrl, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            map(decisions => decisions.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )),
            catchError(err => {
                console.error('Error fetching decisions', err);
                return of([]);
            })
        );
    }

    createDecision(decision: Partial<Decision>): Observable<Decision> {
        return this.http.post<Decision>(this.apiUrl, decision, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    updateDecision(id: string, decision: Partial<Decision>): Observable<Decision> {
        return this.http.put<Decision>(`${this.apiUrl}/${id}`, decision, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    deleteDecision(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }
}
