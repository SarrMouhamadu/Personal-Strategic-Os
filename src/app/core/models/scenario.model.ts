export interface Scenario {
    id: string;
    projectId: string;
    userId: string;
    name: string;
    description: string;
    assumptions: string[];
    outcomes: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'DRAFT' | 'SELECTED' | 'ARCHIVED';
    createdAt: Date;
}
