import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalsService } from '../../services/goals.service';
import { Goal, GoalType, GoalStatus } from '../../../../core/models/goal.model';
import { Observable, map, BehaviorSubject, switchMap, shareReplay } from 'rxjs';

@Component({
    selector: 'app-goals-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div class="container mx-auto max-w-7xl">
        
        <header class="mb-12 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Strategic Goals 2026</h1>
            <p class="text-slate-500 mt-2">Pilotage de la vision et de l'exécution.</p>
          </div>
          <button (click)="openModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add Goal
          </button>
        </header>

        <!-- New Goal Modal -->
        <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
           <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp">
              <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h2 class="text-xl font-bold text-slate-900">Definir un Objectif Stratégique</h2>
                 <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
              </div>
              
              <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                 <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Title</label>
                    <input [(ngModel)]="newGoal.title" type="text" placeholder="e.g., Atteindre 10M€ de CA" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Type</label>
                        <select [(ngModel)]="newGoal.type" (change)="onTypeChange()" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white">
                           <option value="ANNUAL">Annual</option>
                           <option value="QUARTERLY">Quarterly</option>
                        </select>
                    </div>
                    <div *ngIf="newGoal.type === 'QUARTERLY'">
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quarter</label>
                        <select [(ngModel)]="newGoal.quarter" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white">
                           <option [ngValue]="1">Q1</option>
                           <option [ngValue]="2">Q2</option>
                           <option [ngValue]="3">Q3</option>
                           <option [ngValue]="4">Q4</option>
                        </select>
                    </div>
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                        <select [(ngModel)]="newGoal.status" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white">
                           <option value="NOT_STARTED">Not Started</option>
                           <option value="IN_PROGRESS">In Progress</option>
                           <option value="COMPLETED">Completed</option>
                           <option value="AT_RISK">At Risk</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Progress (%)</label>
                        <input [(ngModel)]="newGoal.progress" type="number" min="0" max="100" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                    </div>
                 </div>

                 <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                    <textarea [(ngModel)]="newGoal.description" rows="3" placeholder="Description de l'objectif..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"></textarea>
                 </div>

                 <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Results</label>
                        <button (click)="addKeyResult()" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">+ Add KR</button>
                    </div>
                    <div class="space-y-3">
                       <div *ngFor="let kr of newGoal.keyResults; let i = index" class="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-2 relative">
                          <button (click)="removeKeyResult(i)" class="absolute top-2 right-2 text-slate-400 hover:text-rose-500">
                             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                          <input [(ngModel)]="kr.description" type="text" placeholder="KR Description" class="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                          <div class="grid grid-cols-3 gap-2">
                             <input [(ngModel)]="kr.targetValue" type="number" placeholder="Target" class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                             <input [(ngModel)]="kr.currentValue" type="number" placeholder="Current" class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                             <input [(ngModel)]="kr.unit" type="text" placeholder="Unit" class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                 <button (click)="closeModal()" class="px-6 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 font-medium transition-colors">Cancel</button>
                 <button (click)="saveGoal()" 
                         [disabled]="!isValid()"
                         class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none">
                    Save Goal
                 </button>
              </div>
           </div>
        </div>

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
                <div class="h-full bg-indigo-600 transition-all duration-1000" [style.width.%]="goal.progress"></div>
              </div>

              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-slate-900">{{ goal.title }}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border"
                  [ngClass]="{
                    'bg-green-50 text-green-700 border-green-200': goal.status === 'COMPLETED',
                    'bg-blue-50 text-blue-700 border-blue-200': goal.status === 'IN_PROGRESS',
                    'bg-slate-50 text-slate-500 border-slate-200': goal.status === 'NOT_STARTED',
                    'bg-red-50 text-red-700 border-red-200': goal.status === 'AT_RISK'
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
                  <div class="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" [style.width.%]="goal.progress"></div>
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
    
    private refreshSubject = new BehaviorSubject<void>(undefined);

    // Modal State
    isModalOpen = false;
    newGoal: Partial<Goal> = this.getEmptyGoal();

    constructor(private goalsService: GoalsService) { }

    ngOnInit(): void {
        const allGoals$ = this.refreshSubject.pipe(
            switchMap(() => this.goalsService.getGoals(2026)),
            shareReplay(1)
        );

        this.annualGoals$ = allGoals$.pipe(
            map(goals => goals.filter(g => g.type === 'ANNUAL'))
        );

        this.quarterlyGoals$ = allGoals$.pipe(
            map(goals => goals.filter(g => g.type === 'QUARTERLY'))
        );
    }

    openModal() {
        this.isModalOpen = true;
        this.newGoal = this.getEmptyGoal();
    }

    closeModal() {
        this.isModalOpen = false;
    }

    getEmptyGoal(): Partial<Goal> {
        return {
            title: '',
            description: '',
            type: 'ANNUAL',
            status: 'NOT_STARTED',
            progress: 0,
            year: 2026,
            quarter: 1,
            keyResults: []
        };
    }

    onTypeChange() {
        if (this.newGoal.type === 'ANNUAL') {
            this.newGoal.quarter = undefined;
        } else {
            this.newGoal.quarter = 1;
        }
    }

    addKeyResult() {
        if (!this.newGoal.keyResults) this.newGoal.keyResults = [];
        this.newGoal.keyResults.push({
            description: '',
            currentValue: 0,
            targetValue: 100,
            unit: '%'
        });
    }

    removeKeyResult(index: number) {
        this.newGoal.keyResults?.splice(index, 1);
    }

    isValid(): boolean {
        return !!(this.newGoal.title && this.newGoal.description);
    }

    saveGoal() {
        if (!this.isValid()) return;

        this.goalsService.createGoal(this.newGoal).subscribe(() => {
            this.refreshSubject.next();
            this.closeModal();
        });
    }
}
