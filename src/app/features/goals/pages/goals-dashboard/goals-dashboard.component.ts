import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsService } from '../../services/goals.service';
import { Goal } from '../../../../core/models/goal.model';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-goals-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div class="container mx-auto max-w-7xl">
        
        <header class="mb-12">
          <h1 class="text-3xl font-bold text-slate-900">Strategic Goals 2026</h1>
          <p class="text-slate-500 mt-2">Pilotage de la vision et de l'exécution.</p>
        </header>

        <!-- Annual Goals Section -->
        <section class="mb-16">
          <h2 class="text-xl font-semibold text-indigo-900 mb-6 flex items-center">
            <span class="bg-indigo-100 p-2 rounded-lg mr-3">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </span>
            Annual Objectives
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div *ngFor="let goal of annualGoals$ | async" 
                 class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
              
              <!-- Progress Background -->
              <div class="absolute top-0 left-0 h-1 bg-slate-100 w-full">
                <div class="h-full bg-indigo-600" [style.width.%]="goal.progress"></div>
              </div>

              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-slate-900">{{ goal.title }}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                  [ngClass]="{
                    'bg-green-100 text-green-700': goal.status === 'COMPLETED',
                    'bg-blue-100 text-blue-700': goal.status === 'IN_PROGRESS',
                    'bg-slate-100 text-slate-500': goal.status === 'NOT_STARTED',
                    'bg-red-100 text-red-700': goal.status === 'AT_RISK'
                  }">
                  {{ goal.status.replace('_', ' ') }}
                </span>
              </div>
              
              <p class="text-slate-600 mb-6 min-h-[3rem]">{{ goal.description }}</p>

              <!-- Key Results -->
              <div class="space-y-3">
                <div *ngFor="let kr of goal.keyResults" class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">{{ kr.description }}</span>
                  <div class="flex items-center font-mono font-medium text-slate-700">
                    <span>{{ kr.currentValue }} / {{ kr.targetValue }}</span>
                    <span class="ml-1 text-xs text-slate-400">{{ kr.unit }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Quarterly Goals Section -->
        <section>
          <h2 class="text-xl font-semibold text-emerald-900 mb-6 flex items-center">
            <span class="bg-emerald-100 p-2 rounded-lg mr-3">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </span>
            Q1 Execution Plan
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let goal of quarterlyGoals$ | async" 
                 class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
              
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-slate-900 text-lg line-clamp-1">{{ goal.title }}</h3>
              </div>
              
              <p class="text-slate-500 text-sm mb-4 line-clamp-2">{{ goal.description }}</p>

              <div class="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                  <div class="bg-emerald-500 h-1.5 rounded-full" [style.width.%]="goal.progress"></div>
              </div>
              
              <div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                 <span class="text-xs font-semibold text-slate-500 uppercase">Progress</span>
                 <span class="font-bold text-emerald-600">{{ goal.progress }}%</span>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  `
})
export class GoalsDashboardComponent implements OnInit {
    annualGoals$!: Observable<Goal[]>;
    quarterlyGoals$!: Observable<Goal[]>;

    constructor(private goalsService: GoalsService) { }

    ngOnInit(): void {
        const allGoals$ = this.goalsService.getGoals(2026);

        this.annualGoals$ = allGoals$.pipe(
            map(goals => goals.filter(g => g.type === 'ANNUAL'))
        );

        this.quarterlyGoals$ = allGoals$.pipe(
            map(goals => goals.filter(g => g.type === 'QUARTERLY'))
        );
    }
}
