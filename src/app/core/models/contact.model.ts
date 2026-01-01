export interface Interaction {
    id: string;
    date: string; // ISO String
    type: 'MEETING' | 'EMAIL' | 'CALL' | 'LUNCH';
    summary: string;
    followUpRequired?: boolean;
}

export interface Contact {
    id: string;
    userId: string;
    name: string;
    role: string;
    company: string;
    email?: string;
    linkedin?: string;
    tags: string[];
    influenceLevel: number;
    lastInteraction?: string; // ISO String
    interactions: Interaction[];
    location?: string;
    avatarUrl?: string;
    createdAt?: string; // ISO String
}
