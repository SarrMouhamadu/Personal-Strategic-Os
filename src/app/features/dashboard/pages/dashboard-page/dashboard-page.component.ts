import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats, Activity } from '../../services/dashboard.service';
import { AnalyticsService, AnnualSummary } from '../../../../core/services/analytics.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 pb-12">
      <div class="container mx-auto px-6 py-8 space-y-8">
        
        <!-- V1 Dashboard Header -->
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Strategy Overview</h1>
              <p class="text-slate-500">Transformez vos objectifs en projets concrets.</p>
           </div>
           <div class="flex gap-3">
              <button routerLink="/projects" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center text-sm">
                 <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                 New Project
              </button>
           </div>
        </header>

        <!-- Top Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" *ngIf="stats$ | async as stats">
          
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-colors">
             <div>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Projects</p>
               <p class="text-3xl font-bold text-slate-900 mt-1">{{ stats.activeProjects }}</p>
             </div>
             <div class="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
             </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-100 transition-colors">
             <div>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Rate</p>
               <p class="text-3xl font-bold text-slate-900 mt-1">{{ stats.goalCompletion || 0 }}%</p>
             </div>
             <div class="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
          </div>

           <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-purple-100 transition-colors">
             <div>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Impact</p>
               <p class="text-3xl font-bold text-slate-900 mt-1">{{ stats.averageImpact }}<span class="text-lg text-slate-400 font-normal">/10</span></p>
             </div>
             <div class="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center transition-transform group-hover:scale-110">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-amber-100 transition-colors">
             <div>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Goals</p>
               <p class="text-3xl font-bold text-slate-900 mt-1">{{ (annualSummary$ | async)?.goals?.total || 0 }}</p>
             </div>
             <div class="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-110">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
             </div>
          </div>

        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column (2/3) -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Projects Pipeline Summary -->
            <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100" *ngIf="pipeline$ | async as pipeline">
               <div class="flex items-center justify-between mb-8">
                  <h2 class="text-xl font-bold text-slate-900">Projects Pipeline</h2>
                  <a routerLink="/projects" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Full View →</a>
               </div>
               <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div *ngFor="let status of ['IDEATION', 'BUILD', 'DEPLOYED', 'GROWTH']" 
                       class="p-5 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all cursor-default group">
                     <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">{{ status }}</div>
                     <div class="text-3xl font-bold text-slate-900" 
                          [ngClass]="{
                             'text-slate-400': status === 'IDEATION',
                             'text-blue-500': status === 'BUILD',
                             'text-purple-500': status === 'DEPLOYED',
                             'text-emerald-500': status === 'GROWTH'
                          }">{{ pipeline[status] || 0 }}</div>
                  </div>
               </div>
            </div>

            <!-- Recent Activity -->
             <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
               <h2 class="text-xl font-bold text-slate-900 mb-8">Recent Execution</h2>
               <div class="space-y-6" *ngIf="activity$ | async as activities">
                  
                  <div *ngFor="let act of activities" class="flex group">
                    <div class="mr-6 flex flex-col items-center">
                       <div class="h-10 w-10 rounded-full flex items-center justify-center border-2 z-10 bg-white group-hover:scale-110 transition-transform duration-200"
                           [ngClass]="{
                             'border-indigo-200 text-indigo-600': act.type === 'MILESTONE',
                             'border-amber-200 text-amber-600': act.type === 'DECISION',
                             'border-blue-200 text-blue-600': act.type === 'PROJECT_START',
                             'border-green-200 text-green-600': act.type === 'GOAL_REACHED'
                           }">
                          <svg *ngIf="act.type === 'MILESTONE'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2-2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                          <svg *ngIf="act.type === 'DECISION'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                          <svg *ngIf="act.type === 'PROJECT_START'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          <svg *ngIf="act.type === 'GOAL_REACHED'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       </div>
                       <div class="h-full w-0.5 bg-slate-100 -mt-2 -mb-4"></div>
                    </div>
                    <div class="pb-8">
                       <p class="text-xs font-bold text-slate-400 mb-1 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">{{ act.date | date:'mediumDate' }}</p>
                       <p class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{{ act.title }}</p>
                       <p *ngIf="act.projectName" class="text-sm text-slate-500 mt-1 flex items-center">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-200 mr-2"></span>
                          {{ act.projectName }}
                       </p>
                    </div>
                  </div>

               </div>
            </div>

          </div>

          <!-- Right Column (1/3) -->
          <div class="lg:col-span-1 space-y-8">
            
            <!-- Strategic Focus (Simplified Goals) -->
            <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100" *ngIf="annualSummary$ | async as summary">
               <h2 class="text-xl font-bold text-slate-900 mb-8">Execution Progress</h2>
               
               <div class="space-y-8">
                  <div>
                     <div class="flex justify-between items-end mb-3">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Objectives</span>
                        <span class="text-2xl font-black text-indigo-600">{{ summary.goals.completionRate }}%</span>
                     </div>
                     <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full rounded-full bg-indigo-500 transition-all duration-1000 shadow-sm shadow-indigo-200" [style.width.%]="summary.goals.completionRate"></div>
                     </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                     <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Goals</div>
                        <div class="text-2xl font-bold text-slate-900">{{ summary.goals.total }}</div>
                     </div>
                     <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</div>
                        <div class="text-2xl font-bold text-emerald-600">{{ summary.goals.completed }}</div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- CRM Quick Look -->
            <div class="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
               <div class="flex items-center justify-between mb-8">
                  <h2 class="text-xl font-bold">Network Core</h2>
                  <svg class="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
               </div>
               <p class="text-slate-400 text-sm mb-6 leading-relaxed">Maintenez vos relations stratégiques pour débloquer de nouvelles opportunités.</p>
               <button routerLink="/network" class="w-full bg-white text-slate-900 hover:bg-slate-100 transition-colors py-3 rounded-xl font-bold text-xs uppercase tracking-widest">
                  Manage Contacts
               </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class DashboardPageComponent implements OnInit {

  stats$!: Observable<DashboardStats>;
  activity$!: Observable<Activity[]>;
  annualSummary$!: Observable<AnnualSummary | undefined>;
  pipeline$!: Observable<{ [status: string]: number }>;

  constructor(
    private dashboardService: DashboardService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this.stats$ = this.dashboardService.getGlobalStats();
    this.activity$ = this.dashboardService.getRecentActivity();
    this.annualSummary$ = this.analyticsService.getAnnualSummary();
    this.pipeline$ = this.dashboardService.getProjectsPipelineStats();
  }
}
