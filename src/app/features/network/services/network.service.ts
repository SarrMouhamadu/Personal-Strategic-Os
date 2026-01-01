import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Contact, Interaction } from '../../../core/models/contact.model';
import { Opportunity } from '../../../core/models/opportunity.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = 'http://localhost:3000/api/contacts';

    getContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(this.apiUrl, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            catchError(err => {
                console.error('Error fetching contacts', err);
                return of([]);
            })
        );
    }

    getContactById(id: string): Observable<Contact | undefined> {
        return this.http.get<Contact>(`${this.apiUrl}/${id}`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        }).pipe(
            catchError(err => {
                console.error('Error fetching contact', err);
                return of(undefined);
            })
        );
    }

    createContact(contact: Partial<Contact>): Observable<Contact> {
        return this.http.post<Contact>(this.apiUrl, contact, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    deleteContact(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    addInteraction(contactId: string, interaction: Partial<Interaction>): Observable<Interaction> {
        return this.http.post<Interaction>(`${this.apiUrl}/${contactId}/interactions`, interaction, {
            headers: { 'Authorization': `Bearer ${this.auth.token()}` }
        });
    }

    getOpportunities(): Observable<Opportunity[]> {
        // Mocking for now as requested by the UI components
        return of([
            { id: '1', title: 'Seed Round - VCs', value: 500000, status: 'NEGOTIATION', contactId: 'c1', likelihood: 60 },
            { id: '2', title: 'Enterprise Partnership', value: 120000, status: 'DETECTED', contactId: 'c2', likelihood: 30 },
            { id: '3', title: 'Acquisition Offer', value: 2000000, status: 'WON', contactId: 'c3', likelihood: 100 }
        ]);
    }
}
