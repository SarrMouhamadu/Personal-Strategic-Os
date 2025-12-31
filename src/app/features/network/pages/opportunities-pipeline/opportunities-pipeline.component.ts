import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NetworkService } from '../../services/network.service';
import { Opportunity } from '../../../../core/models/opportunity.model';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-opportunities-pipeline',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6 overflow-x-auto">
      <div class="min-w-[1200px] mx-auto">
        
        <header class="flex justify-between items-center mb-8">
          <div>
            <div class="flex items-center space-x-2 text-sm text-slate-500 mb-1">
               <a routerLink="/network" class="hover:text-indigo-600">Network</a>
               <span>/</span>
               <span>Opportunities</span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900">Sales Pipeline</h1>
            <p class="text-slate-500 mt-2">Suivi des deals, levées de fonds et partenariats.</p>
          </div>
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             Add Opportunity
          </button>
        </header>

        <div class="grid grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          
          <!-- Column: DETECTED -->
          <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Detected</h2>
              <span class="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ (detected$ | async)?.length || 0 }}</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
               <ng-container *ngTemplateOutlet="oppCard; context: { $implicit: detected$ | async }"></ng-container>
            </div>
          </div>

          <!-- Column: CONTACTED -->
          <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold text-blue-500 uppercase tracking-wider">Contacted</h2>
              <span class="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ (contacted$ | async)?.length || 0 }}</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
               <ng-container *ngTemplateOutlet="oppCard; context: { $implicit: contacted$ | async }"></ng-container>
            </div>
          </div>

          <!-- Column: NEGOTIATION -->
          <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold text-orange-500 uppercase tracking-wider">Negotiation</h2>
              <span class="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ (negotiation$ | async)?.length || 0 }}</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
               <ng-container *ngTemplateOutlet="oppCard; context: { $implicit: negotiation$ | async }"></ng-container>
            </div>
          </div>

          <!-- Column: WON -->
          <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold text-emerald-500 uppercase tracking-wider">Won</h2>
              <span class="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ (won$ | async)?.length || 0 }}</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
               <ng-container *ngTemplateOutlet="oppCard; context: { $implicit: won$ | async }"></ng-container>
               
               <div *ngIf="(won$ | async)?.length === 0" class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm">
                 Closing deals is the goal!
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Template for Opportunity Card -->
    <ng-template #oppCard let-opps>
      <div *ngFor="let opp of opps" 
           class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col">
        
        <h3 class="font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{{ opp.title }}</h3>
        
        <div class="flex justify-between items-center text-sm text-slate-500 mb-3">
           <span class="font-mono">{{ opp.value | currency:'EUR':'symbol':'1.0-0' }}</span>
           <span class="bg-slate-100 px-2 py-0.5 rounded text-xs">{{ opp.likelihood }}% prob.</span>
        </div>

        <div class="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
           <div class="flex items-center">
             <div class="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 mr-2">C</div>
             <span>Contact ID: {{ opp.contactId }}</span>
           </div>
        </div>

      </div>
    </ng-template>
  `,
    styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
  `]
})
export class OpportunitiesPipelineComponent implements OnInit {
    detected$!: Observable<Opportunity[]>;
    contacted$!: Observable<Opportunity[]>;
    negotiation$!: Observable<Opportunity[]>;
    won$!: Observable<Opportunity[]>;

    constructor(private networkService: NetworkService) { }

    ngOnInit(): void {
        const allOpps$ = this.networkService.getOpportunities();

        this.detected$ = allOpps$.pipe(map(ops => ops.filter(o => o.status === 'DETECTED')));
        this.contacted$ = allOpps$.pipe(map(ops => ops.filter(o => o.status === 'CONTACTED')));
        this.negotiation$ = allOpps$.pipe(map(ops => ops.filter(o => o.status === 'NEGOTIATION')));
        this.won$ = allOpps$.pipe(map(ops => ops.filter(o => o.status === 'WON')));
    }
}
