import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Profile } from '../../../core/models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class IdentityService {

    private mockProfile: Profile = {
        id: '1',
        fullName: 'Founding User',
        tagline: 'Architect of the Personal Strategic OS',
        bio: 'Fondateur passionné par la technologie et la stratégie, construisant des systèmes pour maximiser l\'impact.',
        roles: [
            {
                id: 'r1',
                title: 'Founder & CEO',
                company: 'Tech Ventures',
                description: 'Pilotage de la vision stratégique et développement produit.',
                startDate: new Date('2024-01-01'),
                current: true,
                highlights: ['Lancement de 3 MVP', 'Croissance 200% YoY']
            },
            {
                id: 'r2',
                title: 'CTO',
                company: 'StartUp Factory',
                description: 'Direction technique et architecture.',
                startDate: new Date('2020-01-01'),
                endDate: new Date('2023-12-31'),
                current: false,
                highlights: ['Architecture micro-services', 'Team de 15 devs']
            }
        ],
        skills: [
            { id: 's1', name: 'Strategic Planning', category: 'Strategic', level: 90, notable: true },
            { id: 's2', name: 'Angular & Web Arch', category: 'Technical', level: 95, notable: true },
            { id: 's3', name: 'Team Leadership', category: 'Leadership', level: 85 },
            { id: 's4', name: 'System Design', category: 'Technical', level: 88, notable: true }
        ]
    };

    /**
     * Récupère le profil principal du fondateur.
     */
    getProfile(): Observable<Profile> {
        return of(this.mockProfile);
    }
}
