export type ResourceType = 'NOTE' | 'ARTICLE' | 'COURSE' | 'TOOL' | 'BOOK';

export interface Resource {
    id: string;
    title: string;
    type: ResourceType;
    summary: string;
    url?: string;
    tags: string[];
    projectId?: string; // Link to project (US-17)
    dateAdded: Date;
    status: 'TO_PROCESS' | 'PROCESSED' | 'ARCHIVED';
}
