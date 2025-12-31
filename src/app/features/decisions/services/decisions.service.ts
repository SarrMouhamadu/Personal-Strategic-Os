import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Decision } from '../../../core/models/decision.model';

@Injectable({
    providedIn: 'root'
})
export class DecisionsService {

    private mockDecisions: Decision[] = [
        {
            id: 'd1',
            title: 'Adoption de Angular & TailwindCSS',
            date: new Date('2025-12-30'),
            status: 'DECIDED',
            impact: 'HIGH',
            context: 'Besoin d\'un framework robuste et d\'un sytème de style rapide pour le Personal Strategic OS.',
            choice: 'Utiliser Angular v19+ et TailwindCSS.',
            rationale: 'Angular offre une structure forte pour un projet évolutif. Tailwind permet un design premium rapide sans gérer de gros fichiers CSS custom.',
            tags: ['Tech', 'Architecture', 'Frontend']
        },
        {
            id: 'd2',
            title: 'Priorisation du module Identity',
            date: new Date('2025-12-31'),
            status: 'DECIDED',
            impact: 'MEDIUM',
            context: 'Par où commencer le développement de l\'OS personnel ?',
            choice: 'Commencer par le module Identity (US-01).',
            rationale: 'Chaque décision future doit être alignée avec l\'identité "Unique & Stratégique". C\'est la fondation.',
            tags: ['Stratégie', 'Roadmap']
        },
        {
            id: 'd3',
            title: 'Externalisation de la comptabilité',
            date: new Date('2026-01-15'),
            status: 'PENDING',
            impact: 'LOW',
            context: 'Perte de temps sur les tâches administratives.',
            choice: 'En attente de devis de 3 experts comptables.',
            rationale: 'Libérer 4h/semaine pour la stratégie produit.',
            tags: ['Opérations', 'Finance']
        }
    ];

    getDecisions(): Observable<Decision[]> {
        // Return sorted by date descending
        return of(this.mockDecisions.sort((a, b) => b.date.getTime() - a.date.getTime()));
    }
}
