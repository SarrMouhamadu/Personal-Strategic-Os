export interface Scenario {
    id: string;
    title: string;
    type: 'OPTIMISTIC' | 'REALISTIC' | 'PESSIMISTIC';
    revenueProjection: number;
    costProjection: number;
    riskScore: number; // 0-100
    notes: string;
}
