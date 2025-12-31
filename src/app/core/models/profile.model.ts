export interface Profile {
    id: string;
    fullName: string;
    tagline: string;
    bio: string;
    avatarUrl?: string;
    roles: Role[];
    skills: Skill[];
}

export interface Role {
    id: string;
    title: string;
    company?: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    highlights: string[];
}

export interface Skill {
    id: string;
    name: string;
    category: 'Strategic' | 'Technical' | 'Leadership' | 'Other';
    level: number; // 0-100
    notable?: boolean;
}
