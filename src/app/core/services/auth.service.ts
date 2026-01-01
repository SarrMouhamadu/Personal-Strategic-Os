import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of, Observable } from 'rxjs';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'PRIVATE' | 'PUBLIC' | 'INVESTOR';
}

export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly authUrl = 'http://localhost:3000/api/auth';
    private readonly usersUrl = 'http://localhost:3000/api/users';

    // App state
    currentUser = signal<User | null>(this.getStoredUser());
    token = signal<string | null>(localStorage.getItem('auth_token'));

    isAuthenticated() {
        return !!this.token();
    }

    login(credentials: any): Observable<AuthResponse | null> {
        return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials).pipe(
            tap(response => this.handleAuth(response)),
            catchError(err => {
                console.error('Login failed', err);
                return of(null);
            })
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.authUrl}/register`, userData).pipe(
            catchError(err => {
                console.error('Registration failed', err);
                return of(null);
            })
        );
    }

    updateRole(role: string): Observable<any> {
        return this.http.patch(`${this.usersUrl}/role`, { role }, {
            headers: { 'Authorization': `Bearer ${this.token()}` }
        }).pipe(
            tap(() => {
                const user = this.currentUser();
                if (user) {
                    const updatedUser = { ...user, role: role as any };
                    this.currentUser.set(updatedUser);
                    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                }
            }),
            catchError(err => {
                console.error('Update role failed', err);
                return of(null);
            })
        );
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        this.token.set(null);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    private handleAuth(response: AuthResponse) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        this.token.set(response.token);
        this.currentUser.set(response.user);
    }

    private getStoredUser(): User | null {
        const user = localStorage.getItem('auth_user');
        return user ? JSON.parse(user) : null;
    }
}
