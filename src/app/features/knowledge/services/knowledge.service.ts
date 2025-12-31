import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Resource } from '../../../core/models/resource.model';

@Injectable({
    providedIn: 'root'
})
export class KnowledgeService {

    private mockResources: Resource[] = [
        {
            id: 'r1',
            title: 'Angular Standalone Components Guide',
            type: 'ARTICLE',
            summary: 'Guide officiel sur la migration vers les composants standalone.',
            url: 'https://angular.io/guide/standalone-components',
            tags: ['Angular', 'Frontend', 'Best Practices'],
            projectId: 'p2', // Linked to Personal OS
            dateAdded: new Date('2025-11-10'),
            status: 'PROCESSED'
        },
        {
            id: 'r2',
            title: 'Supabase vs Firebase Pricing',
            type: 'NOTE',
            summary: 'Comparatif des coûts pour le scaling. Supabase semble plus avantageux pour le gros volume de lectures.',
            tags: ['Backend', 'Database', 'Cost'],
            projectId: 'p1', // Linked to EcoTrack
            dateAdded: new Date('2025-12-05'),
            status: 'PROCESSED'
        },
        {
            id: 'r3',
            title: 'The Lean Startup',
            type: 'BOOK',
            summary: 'Concepts clés: MVP, Pivot, Build-Measure-Learn.',
            tags: ['Strategy', 'Startup'],
            dateAdded: new Date('2025-01-15'),
            status: 'ARCHIVED'
        },
        {
            id: 'r4',
            title: 'Tailwind UI Components',
            type: 'TOOL',
            summary: 'Bibliothèque de composants UI premium.',
            url: 'https://tailwindui.com',
            tags: ['UI/UX', 'Design'],
            dateAdded: new Date('2025-12-28'),
            status: 'TO_PROCESS'
        }
    ];

    getResources(): Observable<Resource[]> {
        return of(this.mockResources);
    }

    getResourcesByProjectId(projectId: string): Observable<Resource[]> {
        return of(this.mockResources.filter(r => r.projectId === projectId));
    }
}
