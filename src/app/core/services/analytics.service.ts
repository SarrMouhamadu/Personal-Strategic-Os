import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ProjectsService } from '../../features/projects/services/projects.service';
import { GoalsService } from '../../features/goals/services/goals.service';

export interface AnnualSummary {
  year: number;
  projects: {
    total: number;
    active: number;
    deployed: number;
  };
  goals: {
    total: number;
    completed: number;
    completionRate: number;
  };
  impact: {
    PERSONAL: number;
    NETWORK: number;
    SOCIAL: number;
    ENVIRONMENTAL: number;
    [key: string]: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private projectsService = inject(ProjectsService);
  private goalsService = inject(GoalsService);

  getAnnualSummary(year?: number): Observable<AnnualSummary | undefined> {
    const targetYear = year || new Date().getFullYear();

    return forkJoin({
      projects: this.projectsService.getProjects(),
      goals: this.goalsService.getGoals(targetYear)
    }).pipe(
      map(({ projects, goals }) => {
        // Calculate project stats
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.status !== 'ARCHIVED').length;
        const deployedProjects = projects.filter(p => p.status === 'DEPLOYED' || p.status === 'GROWTH').length;

        // Calculate goal stats
        const totalGoals = goals.length;
        const completedGoals = goals.filter(g => g.status === 'COMPLETED').length;
        const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

        // Calculate impact scores by dimension
        const impactMap: { [key: string]: { total: number, count: number } } = {
          PERSONAL: { total: 0, count: 0 },
          NETWORK: { total: 0, count: 0 },
          SOCIAL: { total: 0, count: 0 },
          ENVIRONMENTAL: { total: 0, count: 0 }
        };

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

        const impact = {
          PERSONAL: impactMap['PERSONAL'].count > 0 
            ? Math.round(impactMap['PERSONAL'].total / impactMap['PERSONAL'].count) 
            : 0,
          NETWORK: impactMap['NETWORK'].count > 0 
            ? Math.round(impactMap['NETWORK'].total / impactMap['NETWORK'].count) 
            : 0,
          SOCIAL: impactMap['SOCIAL'].count > 0 
            ? Math.round(impactMap['SOCIAL'].total / impactMap['SOCIAL'].count) 
            : 0,
          ENVIRONMENTAL: impactMap['ENVIRONMENTAL'].count > 0 
            ? Math.round(impactMap['ENVIRONMENTAL'].total / impactMap['ENVIRONMENTAL'].count) 
            : 0
        };

        return {
          year: targetYear,
          projects: {
            total: totalProjects,
            active: activeProjects,
            deployed: deployedProjects
          },
          goals: {
            total: totalGoals,
            completed: completedGoals,
            completionRate
          },
          impact
        };
      }),
      catchError(err => {
        console.error('Error fetching annual summary', err);
        return of(undefined);
      })
    );
  }
}
