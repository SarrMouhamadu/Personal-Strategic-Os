import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { Project, ProjectStatus } from '../../../../core/models/project.model';
import { Observable, map, BehaviorSubject, switchMap, shareReplay } from 'rxjs';

@Component({
  selector: 'app-projects-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6 overflow-x-auto">
      <div class="min-w-[1200px] mx-auto">
        
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Projects Pipeline</h1>
            <p class="text-slate-500 mt-1">Vue Kanban pour prioriser l'exécution.</p>
          </div>
          <button (click)="showModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center text-sm active:scale-95">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             New Project
          </button>
        </header>

        <div class="grid grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          
          <!-- Column Template -->
          <ng-container *ngFor="let col of columns">
            <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60 transition-colors hover:bg-slate-100/80">
              <div class="flex items-center justify-between mb-4 px-2">
                <h2 class="text-sm font-bold uppercase tracking-wider" [ngClass]="col.color">{{ col.label }}</h2>
                <span class="bg-white/80 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">{{ (getProjectsByStatus(col.status) | async)?.length || 0 }}</span>
              </div>
              <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                 <ng-container *ngTemplateOutlet="projectCard; context: { $implicit: getProjectsByStatus(col.status) | async }"></ng-container>
                 <div *ngIf="(getProjectsByStatus(col.status) | async)?.length === 0" class="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                   Bruit blanc... Aucun projet ici
                 </div>
              </div>
            </div>
          </ng-container>

        </div>

      </div>
    </div>

    <!-- New Project Modal -->
    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 class="text-xl font-bold text-slate-900">Nouvelle Initiative Stratégique</h3>
             <button (click)="showModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
          
          <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="p-6 space-y-5">
             <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nom du Projet</label>
                <input type="text" formControlName="name" placeholder="ex: Personal Strategic OS"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
             </div>
             
             <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Tagline</label>
                <input type="text" formControlName="tagline" placeholder="La vision synthétisée en une phrase"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
             </div>

             <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Statut</label>
                   <select formControlName="status" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                      <option value="IDEATION">Ideation</option>
                      <option value="BUILD">Build</option>
                      <option value="DEPLOYED">Deployed</option>
                      <option value="GROWTH">Growth</option>
                   </select>
                </div>
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Accès</label>
                   <select formControlName="accessLevel" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                      <option value="PRIVATE">🔒 Private</option>
                      <option value="TEAM">👥 Team</option>
                      <option value="PUBLIC">🌐 Public</option>
                   </select>
                </div>
             </div>

             <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Vision Stratégique</label>
                <textarea formControlName="description" rows="3" placeholder="Description détaillée du projet et de son impact attendu..."
                          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"></textarea>
             </div>

             <div class="pt-4 flex gap-3">
                <button type="button" (click)="showModal = false" 
                        class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">Annuler</button>
                <button type="submit" [disabled]="projectForm.invalid || isSubmitting"
                        class="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none uppercase tracking-widest text-xs">
                    {{ isSubmitting ? 'Lancement...' : 'Créer le Projet' }}
                </button>
             </div>
          </form>
       </div>
    </div>

    <!-- Template for Project Card -->
    <ng-template #projectCard let-projects>
      <div *ngFor="let project of projects" 
           [routerLink]="['/projects', project.id]"
           class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden">
        
        <!-- Status Indicator Dot -->
        <div class="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <svg class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </div>

        <div class="flex justify-between items-start mb-3">
           <h3 class="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-all pr-4">{{ project.name }}</h3>
           <div class="h-8 w-8 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-100 shadow-sm transition-all group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100">
              {{ project.name.charAt(0) }}
           </div>
        </div>

        <p class="text-xs text-slate-500 mb-4 line-clamp-3 leading-relaxed transition-colors group-hover:text-slate-600">{{ project.tagline }}</p>

        <div class="flex flex-wrap gap-1.5 mt-auto">
          <span *ngFor="let tech of project.techStack?.slice(0, 3)" class="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 transition-all group-hover:border-indigo-100 group-hover:bg-indigo-50/50">
            {{ tech }}
          </span>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
    .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class ProjectsListPageComponent implements OnInit {
  private refreshSubject = new BehaviorSubject<void>(undefined);
  projects$!: Observable<Project[]>;

  showModal = false;
  isSubmitting = false;
  projectForm: any;

  columns = [
    { label: 'Ideation', status: 'IDEATION' as ProjectStatus, color: 'text-slate-500' },
    { label: 'Build', status: 'BUILD' as ProjectStatus, color: 'text-blue-500' },
    { label: 'Deployed', status: 'DEPLOYED' as ProjectStatus, color: 'text-purple-500' },
    { label: 'Growth', status: 'GROWTH' as ProjectStatus, color: 'text-emerald-500' }
  ];

  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      tagline: ['', Validators.required],
      status: ['IDEATION', Validators.required],
      accessLevel: ['PRIVATE', Validators.required],
      description: ['', Validators.required],
      techStack: [['Angular']] // Default
    });
  }

  ngOnInit(): void {
    this.projects$ = this.refreshSubject.pipe(
      switchMap(() => this.projectsService.getProjects()),
      shareReplay(1)
    );
  }

  getProjectsByStatus(status: ProjectStatus): Observable<Project[]> {
    return this.projects$.pipe(map(projects => projects.filter(p => p.status === status)));
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.isSubmitting = true;
      this.projectsService.createProject(this.projectForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showModal = false;
          this.projectForm.reset({ status: 'IDEATION', accessLevel: 'PRIVATE', techStack: ['Angular'] });
          this.refreshSubject.next();
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Creation failed', err);
        }
      });
    }
  }
}
