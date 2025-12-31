import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../../../core/models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    private mockProjects: Project[] = [
        {
            id: 'p1',
            name: 'Personal Strategic OS',
            tagline: 'Le centre de commandement pour une vie intentionnelle.',
            description: 'Une plateforme intégrée pour aligner identité, objectifs, projets et décisions. L\'objectif est de passer d\'une gestion réactive à une gestion pro-active de sa carrière et de ses entreprises.',
            status: 'DEPLOYED',
            techStack: ['Angular', 'TailwindCSS', 'TypeScript'],
            roadmap: [
                { id: 'm1', title: 'Concept & Vision', date: new Date('2025-12-28'), completed: true },
                { id: 'm2', title: 'US-01 Identity', date: new Date('2025-12-30'), completed: true },
                { id: 'm3', title: 'US-04 Projects', date: new Date('2026-01-05'), completed: false }
            ],
            swot: {
                strengths: ['Vision claire', 'Full Stack control', 'Usage personnel (Dogfooding)'],
                weaknesses: ['Temps de dev limité', 'Complexité croissante'],
                opportunities: ['Scalabilité vers un SaaS', 'Open Source Community'],
                threats: ['Obsolescence technique rapide', 'Perte de focus']
            },
            kpis: [
                { id: 'k1', label: 'Features Shipped', value: 7, trend: 'UP', status: 'GOOD' },
                { id: 'k2', label: 'System Usage', value: 'Daily', trend: 'STABLE', status: 'GOOD' }
            ],
            impact: [
                { dimension: 'PERSONAL', score: 10, description: 'Clarté mentale et Focus' },
                { dimension: 'NETWORK', score: 6, description: 'Présentation aux investisseurs' }
            ],
            accessLevel: 'PRIVATE',
            compliance: {
                gdprStatus: 'PENDING_AUDIT',
                dataCollected: ['PERSONAL_GOALS', 'FINANCIAL_DATA', 'CONTACTS'],
                lastAuditDate: undefined
            }
        },
        {
            id: 'p2',
            name: 'Dating Platform',
            tagline: 'Rencontres sérieuses basées sur les valeurs.',
            description: 'Plateforme de matchmaking utilisant l\'IA pour connecter les gens sur la base de leurs aspirations de vie profondes plutôt que sur des critères superficiels.',
            status: 'IDEATION',
            techStack: ['Angular', 'Supabase', 'Python'],
            documents: [
                { id: 'd1', name: 'Pitch Deck v1', type: 'SLIDES', url: '#' },
                { id: 'd2', name: 'Market Analysis', type: 'PDF', url: '#' },
                { id: 'd3', name: 'Competitor Grid', type: 'SHEET', url: '#' }
            ],
            roadmap: [
                { id: 'm4', title: 'Market Research', date: new Date('2026-02-01'), completed: false },
                { id: 'm5', title: 'Prototype UX', date: new Date('2026-03-15'), completed: false }
            ],
            accessLevel: 'TEAM',
            compliance: {
                gdprStatus: 'NON_COMPLIANT',
                dataCollected: ['USER_PROFILE', 'MATCH_PREFERENCES', 'CHAT_LOGS'],
                lastAuditDate: undefined
            }
        },
        {
            id: 'p3',
            name: 'EcoTrack',
            tagline: 'Suivi d\'empreinte carbone pour PME.',
            description: 'Outil SaaS B2B permettant aux PME de mesurer et réduire leur impact environnemental sans complexité administrative.',
            status: 'GROWTH',
            accessLevel: 'PUBLIC',
            techStack: ['React', 'Node.js', 'PostgreSQL'],
            roadmap: [
                { id: 'm6', title: 'V1 Launch', date: new Date('2025-06-01'), completed: true },
                { id: 'm7', title: 'Partnership API', date: new Date('2025-11-20'), completed: true },
                { id: 'm8', title: 'International Expansion', date: new Date('2026-04-01'), completed: false }
            ],
            impact: [
                { dimension: 'ENVIRONMENTAL', score: 9, description: 'Réduction directe CO2 PME' },
                { dimension: 'SOCIAL', score: 7, description: 'Sensibilisation écologique' }
            ],
            compliance: {
                gdprStatus: 'COMPLIANT',
                dataCollected: ['EMAIL', 'COMPANY_DATA', 'ENERGY_USAGE'],
                lastAuditDate: new Date('2025-11-15'),
                dpoContact: 'dpo@ecotrack.io'
            }
        }
    ];

    getProjects(): Observable<Project[]> {
        return of(this.mockProjects);
    }

    getProjectById(id: string): Observable<Project | undefined> {
        const project = this.mockProjects.find(p => p.id === id);
        return of(project);
    }
}
