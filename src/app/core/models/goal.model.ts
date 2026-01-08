export type GoalType = 'ANNUAL' | 'QUARTERLY';
export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'AT_RISK';

export interface KeyResult {
    id?: string;
    description: string;
    targetValue: number;
    currentValue: number;
    unit: string;
}

export interface Goal {
    id: string;
    type: GoalType;
    year: number;
    quarter?: number; // 1-4, requis si type === 'QUARTERLY'
    title: string;
    description: string;
    status: GoalStatus;
    progress: number; // 0-100
    keyResults: KeyResult[];
}
