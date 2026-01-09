import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Profile } from '../../../core/models/profile.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class IdentityService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = '/api/profile';

    getProfile(): Observable<Profile> {
        return this.http.get<Profile>(this.apiUrl, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            catchError(err => {
                console.error('Error fetching profile', err);
                return of({} as Profile);
            })
        );
    }

    updateProfile(profile: Profile): Observable<Profile> {
        return this.http.put<Profile>(this.apiUrl, profile, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    uploadAvatar(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('avatar', file);

        return this.http.post(`${this.apiUrl}/avatar`, formData, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }
}
