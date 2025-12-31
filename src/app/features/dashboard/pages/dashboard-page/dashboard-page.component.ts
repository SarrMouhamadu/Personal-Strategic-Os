import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats, ImpactDimension, Activity } from '../../services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      <!-- Header -->
      <div class="bg-white border-b border-slate-200">
        <div class="container mx-auto px-6 py-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-slate-900">Command Center</h1>
              <p class="text-slate-500 mt-1">Global Overview of your Strategic Empire</p>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-slate-500">Last updated: Just now</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-6 py-8 space-y-8">
        
        <!-- Top Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" *ngIf="stats$ | async as stats">
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
               <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Projects</p>
               <p class="text-3xl font-bold text-slate-900 mt-1">{{ stats.activeProjects }}</p>
             </div>
             <div class="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
             </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
               <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Est. Monthly Rev</p>
               <p class="text-3xl font-bold text-slate-900 mt-1">{{ stats.totalRevenue | currency:'USD':'symbol':'1.0-0' }}</p>
             </div>
             <div class="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
          </div>

           <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
               <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Impact Score</p>
               <p class="text-3xl font-bold text-slate-900 mt-1">{{ stats.averageImpact }}<span class="text-lg text-slate-400 font-normal">/10</span></p>
             </div>
             <div class="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
               <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Goals Crushed</p>
               <p class="text-3xl font-bold text-slate-900 mt-1">{{ stats.goalsAchieved }}</p>
             </div>
             <div class="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
          </div>

        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column (2/3) -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Financial Trend -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100" *ngIf="financials$ | async as fin">
               <div class="flex justify-between items-center mb-6">
                 <h2 class="text-lg font-bold text-slate-900">Revenue Trajectory</h2>
                 <span class="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">+22% vs last month</span>
               </div>
               
               <div class="h-64 flex items-end justify-between space-x-2">
                 <div *ngFor="let rev of fin.monthlyRevenue; let i = index" class="w-full flex flex-col items-center group">
                    <div class="w-full bg-emerald-100 rounded-t-sm relative group-hover:bg-emerald-200 transition-colors" 
                         [style.height.%]="(rev / 15000) * 100">
                         <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {{ rev | currency:'USD' }}
                         </div>
                    </div>
                    <span class="text-xs text-slate-500 mt-2">{{ fin.months[i] }}</span>
                 </div>
               </div>
            </div>

            <!-- Recent Activity -->
             <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
               <h2 class="text-lg font-bold text-slate-900 mb-6">Recent Activity</h2>
               <div class="space-y-6" *ngIf="activity$ | async as activities">
                  
                  <div *ngFor="let act of activities" class="flex group">
                    <div class="mr-4 flex flex-col items-center">
                       <div class="h-10 w-10 rounded-full flex items-center justify-center border-2 z-10 bg-white group-hover:scale-110 transition-transform duration-200"
                           [ngClass]="{
                             'border-indigo-200 text-indigo-600': act.type === 'MILESTONE',
                             'border-amber-200 text-amber-600': act.type === 'DECISION',
                             'border-blue-200 text-blue-600': act.type === 'PROJECT_START',
                             'border-green-200 text-green-600': act.type === 'GOAL_REACHED'
                           }">
                          <svg *ngIf="act.type === 'MILESTONE'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                          <svg *ngIf="act.type === 'DECISION'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                          <svg *ngIf="act.type === 'PROJECT_START'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          <svg *ngIf="act.type === 'GOAL_REACHED'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       </div>
                       <div class="h-full w-0.5 bg-slate-100 -mt-2 -mb-4"></div>
                    </div>
                    <div class="pb-6">
                       <p class="text-sm text-slate-500 mb-1 group-hover:text-slate-700 transition-colors">{{ act.date | date:'mediumDate' }}</p>
                       <p class="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{{ act.title }}</p>
                       <p *ngIf="act.projectName" class="text-sm text-indigo-600 mt-0.5 font-medium">{{ act.projectName }}</p>
                    </div>
                  </div>

               </div>
            </div>

          </div>

          <!-- Right Column (1/3) -->
          <div class="lg:col-span-1 space-y-8">
            
            <!-- Impact Radar (US-20) -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h2 class="text-lg font-bold text-slate-900 mb-6">Impact Radar</h2>
              
              <!-- Custom CSS Radar Simulation -->
              <div class="relative h-64 w-full flex items-center justify-center">
                 <!-- Background Circles -->
                 <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-48 h-48 rounded-full border border-slate-100"></div>
                 </div>
                 <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-32 h-32 rounded-full border border-slate-100"></div>
                 </div>
                 <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-16 h-16 rounded-full border border-slate-100"></div>
                 </div>
                 
                 <!-- We will render simple bars for now as Radar needs Canvas/SVG complexity -->
                 <!-- Replacing Radar with Horizontal Bars for robustness in this tech stack constraint -->
              </div>
              
              <div class="space-y-4 -mt-64 relative bg-white/50 backdrop-blur-sm p-4 rounded-xl">
                 <div *ngFor="let dim of impact$ | async" class="group">
                    <div class="flex justify-between items-center text-sm mb-1">
                       <span class="font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{{ dim.label }}</span>
                       <span class="font-bold text-slate-900">{{ dim.value }}/{{ dim.fullMark }}</span>
                    </div>
                    <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div class="h-full rounded-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors" [style.width.%]="(dim.value / dim.fullMark) * 100"></div>
                    </div>
                 </div>
              </div>

            </div>

            <!-- Quick Actions -->
            <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
               <h2 class="text-lg font-bold mb-4">Quick Actions</h2>
               <div class="space-y-3">
                  <a routerLink="/projects" class="block bg-white/10 hover:bg-white/20 transition-all p-3 rounded-lg flex items-center cursor-pointer group">
                     <svg class="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                     <span class="font-medium">New Project</span>
                  </a>
                  <a routerLink="/decisions" class="block bg-white/10 hover:bg-white/20 transition-all p-3 rounded-lg flex items-center cursor-pointer group">
                     <svg class="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                     <span class="font-medium">Log Decision</span>
                  </a>
                  <a routerLink="/network" class="block bg-white/10 hover:bg-white/20 transition-all p-3 rounded-lg flex items-center cursor-pointer group">
                     <svg class="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                     <span class="font-medium">Add Contact</span>
                  </a>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  `
})
export class DashboardPageComponent implements OnInit {

  stats$!: Observable<DashboardStats>;
  impact$!: Observable<ImpactDimension[]>;
  activity$!: Observable<Activity[]>;
  financials$!: Observable<any>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.stats$ = this.dashboardService.getGlobalStats();
    this.impact$ = this.dashboardService.getImpactRadarData();
    this.activity$ = this.dashboardService.getRecentActivity();
    this.financials$ = this.dashboardService.getFinancialSnapshot();
  }
}
