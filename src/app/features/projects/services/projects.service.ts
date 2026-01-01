import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Project } from '../../../core/models/project.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = 'http://localhost:3000/api/projects';

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(this.apiUrl, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            catchError(err => {
                console.error('Error fetching projects', err);
                return of([]);
            })
        );
    }

    getProjectById(id: string): Observable<Project | undefined> {
        return this.http.get<Project>(`${this.apiUrl}/${id}`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            catchError(err => {
                console.error('Error fetching project', err);
                return of(undefined);
            })
        );
    }

    createProject(project: Partial<Project>): Observable<Project> {
        return this.http.post<Project>(this.apiUrl, project, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    updateProject(id: string, project: Partial<Project>): Observable<Project> {
        return this.http.put<Project>(`${this.apiUrl}/${id}`, project, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    archiveProject(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }
}
