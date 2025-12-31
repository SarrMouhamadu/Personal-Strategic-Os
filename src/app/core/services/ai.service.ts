import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class AiService {

    constructor() { }

    generateProjectSummary(project: Project): Observable<string> {
        const summary = `
      **Résumé Exécutif généré par IA :**
      Le projet **${project.name}** ("${project.tagline}") vise à résoudre une problématique clé via une approche technologique robuste (${project.techStack.slice(0, 3).join(', ')}).
      Actuellement en phase de **${project.status}**, il démontre une vision claire : "${project.description.substring(0, 50)}...".
      Le potentiel est confirmé par une roadmap active.
    `;
        return of(summary).pipe(delay(1500)); // Simulate AI processing time
    }

    generatePitch(project: Project, audience: 'INVESTOR' | 'CLIENT' | 'PARTNER'): Observable<string> {
        let pitch = '';

        switch (audience) {
            case 'INVESTOR':
                pitch = `
          **Elevator Pitch (Investisseur) :**
          "Bonjour, je suis le fondateur de **${project.name}**.
          Nous construisons **${project.tagline}** pour capturer une opportunité de marché significative.
          Notre traction actuelle est prometteuse : nous sommes en phase **${project.status}** avec une technologie éprouvée.
          Nous cherchons à accélérer pour dominer notre niche. Parlons chiffres ?"
        `;
                break;
            case 'CLIENT':
                pitch = `
          **Pitch Commercial (Client) :**
          "Vous cherchez une solution pour **${project.description.substring(0, 30)}...** ?
          Découvrez **${project.name}**. C'est ${project.tagline}.
          Simple, puissant et conçu pour vous faire gagner du temps.
          Voulez-vous voir une démo ?"
        `;
                break;
            case 'PARTNER':
                pitch = `
            **Pitch Partenariat :**
            "Nous développons **${project.name}** et nous pensons qu'il y a une synergie évidente avec votre activité.
            Notre stack technique (${project.techStack[0]}) permettrait une intégration rapide.
            Collaborons pour créer de la valeur commune."
        `;
                break;
        }

        return of(pitch).pipe(delay(2000));
    }

    analyzeDecision(context: string): Observable<string> {
        const analysis = `
      **Analyse IA du dilemme :**
      Basé sur le contexte fourni ("${context.substring(0, 20)}..."), voici une recommandation :
      1. **Option A (Plus Sûre)** : Minimise les risques à court terme mais limite l'upside.
      2. **Option B (Plus Audacieuse)** : Maximise le potentiel de croissance mais requiert plus de ressources.
      *Conseil :* Alignez ce choix avec vos KPIs actuels. Si le KPI principal est la croissance, choisissez l'Option B.
    `;
        return of(analysis).pipe(delay(2500));
    }
}
