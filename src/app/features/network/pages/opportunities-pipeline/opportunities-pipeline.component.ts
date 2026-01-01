import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NetworkService } from '../../services/network.service';
import { Opportunity } from '../../../../core/models/opportunity.model';
import { Observable, map, BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-opportunities-pipeline',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
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
          <button (click)="showModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center active:scale-95">
             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             Add Opportunity
          </button>
        </header>

        <div class="grid grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          <!-- Columns -->
          <ng-container *ngFor="let col of columns">
             <div class="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
                <div class="flex items-center justify-between mb-4 px-2">
                  <h2 class="text-sm font-bold uppercase tracking-wider" [ngClass]="col.color">{{ col.label }}</h2>
                  <span class="bg-white/80 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">{{ (getOppsByStatus(col.status) | async)?.length || 0 }}</span>
                </div>
                <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                   <ng-container *ngTemplateOutlet="oppCard; context: { $implicit: getOppsByStatus(col.status) | async }"></ng-container>
                </div>
             </div>
          </ng-container>
        </div>

      </div>
    </div>

    <!-- New Opportunity Modal -->
    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-fadeIn">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 class="text-xl font-bold text-slate-900">Nouveau Deal / Opportunité</h3>
             <button (click)="showModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
          
          <form [formGroup]="oppForm" (ngSubmit)="onSubmit()" class="p-6 space-y-5">
             <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Titre du Deal</label>
                <input type="text" formControlName="title" placeholder="ex: Seed Round - VC X"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
             </div>
             
             <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Valeur (€)</label>
                   <input type="number" formControlName="value" 
                          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                </div>
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Likelihood (%)</label>
                   <input type="number" formControlName="likelihood" 
                          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                </div>
             </div>

             <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Statut</label>
                <select formControlName="status" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                   <option value="DETECTED">Detected</option>
                   <option value="CONTACTED">Contacted</option>
                   <option value="NEGOTIATION">Negotiation</option>
                   <option value="WON">Won</option>
                   <option value="LOST">Lost</option>
                </select>
             </div>

             <div class="pt-4 flex gap-3">
                <button type="button" (click)="showModal = false" 
                        class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">Annuler</button>
                <button type="submit" [disabled]="oppForm.invalid"
                        class="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none uppercase tracking-widest text-xs">
                    Créer l'Opportunité
                </button>
             </div>
          </form>
       </div>
    </div>

    <!-- Template for Opportunity Card -->
    <ng-template #oppCard let-opps>
      <div *ngFor="let opp of opps" 
           class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col">
        <h3 class="font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{{ opp.title }}</h3>
        <div class="flex justify-between items-center text-sm text-slate-500 mb-3">
           <span class="font-mono">{{ opp.value | currency:'XOF':'symbol':'1.0-0' }}</span>
           <span class="bg-slate-100 px-2 py-0.5 rounded text-xs">{{ opp.likelihood }}% prob.</span>
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
export class OpportunitiesPipelineComponent implements OnInit {
  private refreshSubject = new BehaviorSubject<void>(undefined);
  opps$!: Observable<Opportunity[]>;

  showModal = false;
  oppForm: any;

  columns = [
    { label: 'Detected', status: 'DETECTED', color: 'text-slate-500' },
    { label: 'Contacted', status: 'CONTACTED', color: 'text-blue-500' },
    { label: 'Negotiation', status: 'NEGOTIATION', color: 'text-orange-500' },
    { label: 'Won', status: 'WON', color: 'text-emerald-500' }
  ];

  private fb = inject(FormBuilder);
  private networkService = inject(NetworkService);

  constructor() {
    this.oppForm = this.fb.group({
      title: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      likelihood: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: ['DETECTED', Validators.required]
    });
  }

  ngOnInit(): void {
    this.opps$ = this.refreshSubject.pipe(
      switchMap(() => this.networkService.getOpportunities())
    );
  }

  getOppsByStatus(status: string): Observable<Opportunity[]> {
    return this.opps$.pipe(map(opps => opps.filter(o => o.status === status)));
  }

  onSubmit() {
    if (this.oppForm.valid) {
      this.networkService.createOpportunity(this.oppForm.value).subscribe({
        next: () => {
          this.showModal = false;
          this.oppForm.reset({ value: 0, likelihood: 50, status: 'DETECTED' });
          this.refreshSubject.next();
        },
        error: (err) => console.error('Failed to create opportunity', err)
      });
    }
  }
}
