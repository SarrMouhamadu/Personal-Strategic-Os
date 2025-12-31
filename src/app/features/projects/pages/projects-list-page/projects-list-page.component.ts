import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Project, ProjectStatus } from '../../../../core/models/project.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-projects-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6 overflow-x-auto">
      <div class="min-w-[1200px] mx-auto">
        
        <header class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Projects Pipeline</h1>
            <p class="text-slate-500 mt-2">Vue Kanban pour prioriser l'exécution.</p>
          </div>
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             New Project
          </button>
        </header>

        <div class="grid grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          
          <!-- Column: IDEATION -->
          <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Ideation</h2>
              <span class="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ (ideationProjects$ | async)?.length || 0 }}</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
               <ng-container *ngTemplateOutlet="projectCard; context: { $implicit: ideationProjects$ | async }"></ng-container>
            </div>
          </div>

          <!-- Column: BUILD -->
          <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold text-blue-500 uppercase tracking-wider">Build</h2>
              <span class="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ (buildProjects$ | async)?.length || 0 }}</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
               <ng-container *ngTemplateOutlet="projectCard; context: { $implicit: buildProjects$ | async }"></ng-container>
               
               <!-- Empty State Placeholder if needed -->
               <div *ngIf="(buildProjects$ | async)?.length === 0" class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm">
                 No projects building
               </div>
            </div>
          </div>

          <!-- Column: DEPLOYED -->
          <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold text-purple-500 uppercase tracking-wider">Deployed (MVP)</h2>
              <span class="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ (deployedProjects$ | async)?.length || 0 }}</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
               <ng-container *ngTemplateOutlet="projectCard; context: { $implicit: deployedProjects$ | async }"></ng-container>
            </div>
          </div>

          <!-- Column: GROWTH -->
          <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold text-emerald-500 uppercase tracking-wider">Growth</h2>
              <span class="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ (growthProjects$ | async)?.length || 0 }}</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
               <ng-container *ngTemplateOutlet="projectCard; context: { $implicit: growthProjects$ | async }"></ng-container>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Template for Project Card -->
    <ng-template #projectCard let-projects>
      <div *ngFor="let project of projects" 
           [routerLink]="['/projects', project.id]"
           class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group relative">
        
        <div class="flex justify-between items-start mb-3">
           <h3 class="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{{ project.name }}</h3>
           <div class="h-8 w-8 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-100">
              {{ project.name.charAt(0) }}
           </div>
        </div>

        <p class="text-xs text-slate-500 mb-4 line-clamp-3 leading-relaxed">{{ project.tagline }}</p>

        <div class="flex flex-wrap gap-1.5 mt-auto">
          <span *ngFor="let tech of project.techStack.slice(0, 3)" class="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {{ tech }}
          </span>
          <span *ngIf="project.techStack.length > 3" class="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
            +{{ project.techStack.length - 3 }}
          </span>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 20px;
    }
  `]
})
export class ProjectsListPageComponent implements OnInit {
  ideationProjects$!: Observable<Project[]>;
  buildProjects$!: Observable<Project[]>;
  deployedProjects$!: Observable<Project[]>;
  growthProjects$!: Observable<Project[]>;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    const allProjects$ = this.projectsService.getProjects();

    this.ideationProjects$ = allProjects$.pipe(map(projects => projects.filter(p => p.status === 'IDEATION')));
    this.buildProjects$ = allProjects$.pipe(map(projects => projects.filter(p => p.status === 'BUILD')));
    this.deployedProjects$ = allProjects$.pipe(map(projects => projects.filter(p => p.status === 'DEPLOYED')));
    this.growthProjects$ = allProjects$.pipe(map(projects => projects.filter(p => p.status === 'GROWTH')));
  }
}
