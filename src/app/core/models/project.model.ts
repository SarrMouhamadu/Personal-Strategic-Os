export type ProjectStatus = 'IDEATION' | 'BUILD' | 'DEPLOYED' | 'GROWTH' | 'ARCHIVED';

export interface Milestone {
    id: string;
    title: string;
    date: Date;
    completed: boolean;
}

export interface ProjectDocument {
    id: string;
    name: string;
    type: 'PDF' | 'LINK' | 'G-DOC' | 'SHEET' | 'SLIDES';
    url: string;
}

export interface SwotAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface Kpi {
    id: string;
    label: string;
    value: string | number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    status: 'GOOD' | 'WARNING' | 'CRITICAL';
}

export interface ImpactMetric {
    dimension: 'SOCIAL' | 'ENVIRONMENTAL' | 'PERSONAL' | 'NETWORK';
    score: number; // 0-10
    description: string;
    lastMeasured?: string; // ISO Date string
}

export interface ComplianceAudit {
    gdprStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_AUDIT';
    dataCollected: string[]; // e.g. ['EMAIL', 'IP', 'LOCATION']
    lastAuditDate?: Date;
    dpoContact?: string;
}

export interface Project {
    id: string;
    name: string;
    tagline: string;
    description: string; // Vision
    status: ProjectStatus;
    accessLevel: 'PRIVATE' | 'TEAM' | 'PUBLIC';
    logoUrl?: string; // Placeholder or Initials
    techStack: string[];
    roadmap: Milestone[];
    documents?: ProjectDocument[];
    swot?: SwotAnalysis;
    kpis?: Kpi[];
    impact?: ImpactMetric[];
    compliance?: ComplianceAudit;
    createdAt?: string;
    updatedAt?: string;
}
