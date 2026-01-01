import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Resource } from '../../../core/models/resource.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class KnowledgeService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = 'http://localhost:3000/api/knowledge';

    getResources(): Observable<Resource[]> {
        return this.http.get<Resource[]>(this.apiUrl, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            catchError(err => {
                console.error('Error fetching resources', err);
                return of([]);
            })
        );
    }

    getResourcesByProjectId(projectId: string): Observable<Resource[]> {
        return this.getResources().pipe(
            catchError(() => of([]))
        );
    }

    createResource(resource: Partial<Resource>): Observable<Resource> {
        return this.http.post<Resource>(this.apiUrl, resource, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    updateResource(id: string, resource: Partial<Resource>): Observable<Resource> {
        return this.http.put<Resource>(`${this.apiUrl}/${id}`, resource, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    deleteResource(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }
}
