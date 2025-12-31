export type DecisionStatus = 'DRAFT' | 'PENDING' | 'DECIDED' | 'ARCHIVED';
export type DecisionImpact = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Decision {
    id: string;
    title: string;
    date: Date;
    status: DecisionStatus;
    impact: DecisionImpact;
    context: string;   // Le problème ou l'opportunité
    choice: string;    // Ce qui a été décidé
    rationale: string; // Pourquoi ce choix
    tags: string[];
}
