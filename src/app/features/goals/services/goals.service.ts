import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Goal } from '../../../core/models/goal.model';

@Injectable({
    providedIn: 'root'
})
export class GoalsService {

    private mockGoals: Goal[] = [
        {
            id: 'g1',
            type: 'ANNUAL',
            year: 2026,
            title: 'Lancement Commercial Global',
            description: 'Atteindre une présence sur 3 continents avec le produit phare.',
            status: 'IN_PROGRESS',
            progress: 35,
            keyResults: [
                { id: 'kr1', description: 'Chiffre d\'affaires', targetValue: 1000000, currentValue: 350000, unit: 'EUR' },
                { id: 'kr2', description: 'Utilisateurs actifs', targetValue: 50000, currentValue: 12000, unit: 'Users' }
            ]
        },
        {
            id: 'g2',
            type: 'ANNUAL',
            year: 2026,
            title: 'Excellence Opérationnelle',
            description: 'Automatiser 80% des processus internes.',
            status: 'NOT_STARTED',
            progress: 0,
            keyResults: [
                { id: 'kr3', description: 'Processus automatisés', targetValue: 20, currentValue: 2, unit: 'Process' }
            ]
        },
        {
            id: 'g3',
            type: 'QUARTERLY',
            year: 2026,
            quarter: 1,
            title: 'Finalisation MVP v2',
            description: 'Sortir la version stable avec les nouvelles features IA.',
            status: 'AT_RISK',
            progress: 75,
            keyResults: [
                { id: 'kr4', description: 'Features livrées', targetValue: 10, currentValue: 7, unit: 'Feat' },
                { id: 'kr5', description: 'Bugs critiques', targetValue: 0, currentValue: 3, unit: 'Bugs' }
            ]
        },
        {
            id: 'g4',
            type: 'QUARTERLY',
            year: 2026,
            quarter: 1,
            title: 'Recrutement Core Team',
            description: 'Embaucher les 3 leads clés.',
            status: 'COMPLETED',
            progress: 100,
            keyResults: [
                { id: 'kr6', description: 'Recrutements', targetValue: 3, currentValue: 3, unit: 'Hires' }
            ]
        }
    ];

    getGoals(year: number): Observable<Goal[]> {
        return of(this.mockGoals.filter(g => g.year === year));
    }
}
