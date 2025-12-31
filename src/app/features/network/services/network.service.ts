import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact, Interaction } from '../../../core/models/contact.model';
import { Opportunity } from '../../../core/models/opportunity.model';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private mockContacts: Contact[] = [
        {
            id: 'c1',
            name: 'Alice Berthelot',
            role: 'Angel Investor',
            company: 'Future VC',
            tags: ['INVESTOR', 'MENTOR'],
            location: 'Paris, France',
            email: 'alice@future.vc',
            linkedInUrl: '#',
            lastContactDate: new Date('2025-12-15'),
            interactions: [
                { id: 'i1', date: new Date('2025-12-15'), type: 'LUNCH', notes: 'Rencontre introductive. Intéressée par la vision "Personal OS".' },
                { id: 'i2', date: new Date('2025-11-20'), type: 'EMAIL', notes: 'Email de prise de contact envoyé.' }
            ]
        },
        {
            id: 'c2',
            name: 'Marc Dubois',
            role: 'CTO',
            company: 'TechCorp',
            tags: ['TALENT', 'PARTNER'],
            location: 'Lyon, France',
            email: 'marc@techcorp.io',
            lastContactDate: new Date('2025-10-05'),
            interactions: [
                { id: 'i3', date: new Date('2025-10-05'), type: 'CALL', notes: 'Discussion technique sur l\'architecture.' }
            ]
        },
        {
            id: 'c3',
            name: 'Sarah Line',
            role: 'Founder',
            company: 'DesignStudio',
            tags: ['CLIENT', 'PARTNER'],
            location: 'Remote',
            lastContactDate: new Date('2025-12-28'),
            interactions: []
        }
    ];

    private mockOpportunities: Opportunity[] = [
        {
            id: 'o1',
            title: 'Seed Round Funding',
            value: 500000,
            status: 'CONTACTED',
            contactId: 'c1',
            projectId: 'p1',
            likelihood: 20
        },
        {
            id: 'o2',
            title: 'Technical Partnership',
            value: 0,
            status: 'NEGOTIATION',
            contactId: 'c2',
            projectId: 'p2',
            likelihood: 60
        }
    ];

    getContacts(): Observable<Contact[]> {
        return of(this.mockContacts);
    }

    getContactById(id: string): Observable<Contact | undefined> {
        const contact = this.mockContacts.find(c => c.id === id);
        return of(contact);
    }

    getOpportunities(): Observable<Opportunity[]> {
        return of(this.mockOpportunities);
    }
}
