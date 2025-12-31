export type ContactTag = 'INVESTOR' | 'MENTOR' | 'CLIENT' | 'PARTNER' | 'TALENT';

export interface Interaction {
    id: string;
    date: Date;
    type: 'MEETING' | 'EMAIL' | 'CALL' | 'LUNCH';
    notes: string;
}

export interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    avatarUrl?: string; // Placeholder or Initials
    tags: ContactTag[];
    location: string;
    linkedInUrl?: string;
    email?: string;
    phone?: string;
    interactions: Interaction[];
    lastContactDate: Date;
}
