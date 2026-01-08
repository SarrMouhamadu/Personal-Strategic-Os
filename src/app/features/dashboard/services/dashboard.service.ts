import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { GoalsService } from '../../goals/services/goals.service';

export interface DashboardStats {
    activeProjects: number;
    totalProjects: number;
    totalRevenue: number;
    averageImpact: number;
    goalsAchieved: number;
    goalCompletion: number;
}

export interface ImpactDimension {
    label: string;
    value: number; // 0-10
    fullMark: number;
}

export interface Activity {
    id: string;
    type: 'MILESTONE' | 'DECISION' | 'PROJECT_START' | 'GOAL_REACHED';
    title: string;
    date: Date;
    projectId?: string;
    projectName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private projectsService = inject(ProjectsService);
    private goalsService = inject(GoalsService);

    getGlobalStats(): Observable<DashboardStats> {
        const currentYear = new Date().getFullYear();
        
        return forkJoin({
            projects: this.projectsService.getProjects(),
            goals: this.goalsService.getGoals(currentYear)
        }).pipe(
            map(({ projects, goals }) => {
                // Count active projects (not ARCHIVED)
                const activeProjects = projects.filter(p => p.status !== 'ARCHIVED').length;
                
                // Calculate average impact across all projects
                let totalImpact = 0;
                let impactCount = 0;
                projects.forEach(p => {
                    if (p.impact && Array.isArray(p.impact)) {
                        p.impact.forEach(i => {
                            totalImpact += i.score;
                            impactCount++;
                        });
                    }
                });
                const averageImpact = impactCount > 0 ? totalImpact / impactCount : 0;

                // Count completed goals
                const goalsAchieved = goals.filter(g => g.status === 'COMPLETED').length;
                
                // Calculate goal completion percentage
                const goalCompletion = goals.length > 0 
                    ? Math.round((goalsAchieved / goals.length) * 100) 
                    : 0;

                return {
                    activeProjects,
                    totalProjects: projects.length,
                    totalRevenue: 0, // TODO: Calculate from projects if needed
                    averageImpact: Math.round(averageImpact * 10) / 10,
                    goalsAchieved,
                    goalCompletion
                };
            }),
            catchError(err => {
                console.error('Error fetching dashboard stats', err);
                return of({
                    activeProjects: 0,
                    totalProjects: 0,
                    totalRevenue: 0,
                    averageImpact: 0,
                    goalsAchieved: 0,
                    goalCompletion: 0
                });
            })
        );
    }

    getImpactRadarData(): Observable<ImpactDimension[]> {
        return this.projectsService.getProjects().pipe(
            map(projects => {
                const dimensions = ['PERSONAL', 'SOCIAL', 'ENVIRONMENTAL', 'NETWORK'];
                const impactMap: { [key: string]: { total: number, count: number } } = {};

                // Initialize
                dimensions.forEach(dim => {
                    impactMap[dim] = { total: 0, count: 0 };
                });

                // Aggregate impact scores
                projects.forEach(project => {
                    if (project.impact && Array.isArray(project.impact)) {
                        project.impact.forEach(imp => {
                            if (impactMap[imp.dimension]) {
                                impactMap[imp.dimension].total += imp.score;
                                impactMap[imp.dimension].count++;
                            }
                        });
                    }
                });

                // Calculate averages
                return dimensions.map(dim => ({
                    label: dim.charAt(0) + dim.slice(1).toLowerCase(),
                    value: impactMap[dim].count > 0 
                        ? Math.round(impactMap[dim].total / impactMap[dim].count) 
                        : 0,
                    fullMark: 10
                }));
            }),
            catchError(() => of([
                { label: 'Personal', value: 0, fullMark: 10 },
                { label: 'Social', value: 0, fullMark: 10 },
                { label: 'Environmental', value: 0, fullMark: 10 },
                { label: 'Network', value: 0, fullMark: 10 }
            ]))
        );
    }

    getRecentActivity(): Observable<Activity[]> {
        return this.projectsService.getProjects().pipe(
            map(projects => {
                const activities: Activity[] = [];
                
                // Add project creations as activities
                projects.forEach(project => {
                    activities.push({
                        id: project.id,
                        type: 'PROJECT_START',
                        title: `Started ${project.name}`,
                        date: new Date(project.createdAt || new Date()),
                        projectId: project.id,
                        projectName: project.name
                    });
                });

                // Sort by date descending and return last 5
                return activities
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 5);
            }),
            catchError(() => of([]))
        );
    }

    getFinancialSnapshot(): Observable<any> {
        // TODO: Implement real financial tracking if needed
        return of({
            monthlyRevenue: [0, 0, 0, 0, 0, 0],
            months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        });
    }

    getProjectsPipelineStats(): Observable<{ [status: string]: number }> {
        return this.projectsService.getProjects().pipe(
            map(projects => {
                const stats: { [status: string]: number } = {
                    'IDEATION': 0,
                    'BUILD': 0,
                    'DEPLOYED': 0,
                    'GROWTH': 0
                };

                projects.forEach(project => {
                    if (stats.hasOwnProperty(project.status)) {
                        stats[project.status]++;
                    }
                });

                return stats;
            }),
            catchError(() => of({
                'IDEATION': 0,
                'BUILD': 0,
                'DEPLOYED': 0,
                'GROWTH': 0
            }))
        );
    }
}
