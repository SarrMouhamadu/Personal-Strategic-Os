export type OpportunityStatus = 'DETECTED' | 'CONTACTED' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface Opportunity {
    id: string;
    title: string;
    value: number; // Potential value
    status: OpportunityStatus;
    contactId: string; // Linked to a contact
    projectId?: string; // Linked to a project (optional)
    likelihood: number; // 0-100%
    deadline?: Date;
}
