import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecisionsService } from '../../services/decisions.service';
import { AiService } from '../../../../core/services/ai.service';
import { Decision, DecisionStatus, DecisionImpact } from '../../../../core/models/decision.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-decisions-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div class="container mx-auto max-w-4xl">
        
        <header class="flex justify-between items-center mb-12">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Decision Log</h1>
            <p class="text-slate-500 mt-2">Mémoire stratégique et historique des choix.</p>
          </div>
          <button (click)="openModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            New Decision
          </button>
        </header>

        <!-- New Decision Modal -->
        <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
           <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp">
              <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h2 class="text-xl font-bold text-slate-900">Add Strategic Decision</h2>
                 <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
              </div>
              
              <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                 <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Title</label>
                    <input [(ngModel)]="newDecision.title" type="text" placeholder="e.g., Pivot to B2B" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Impact</label>
                        <select [(ngModel)]="newDecision.impact" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white">
                           <option value="HIGH">High</option>
                           <option value="MEDIUM">Medium</option>
                           <option value="LOW">Low</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                        <select [(ngModel)]="newDecision.status" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white">
                           <option value="DRAFT">Draft</option>
                           <option value="PENDING">Pending</option>
                           <option value="DECIDED">Decided</option>
                        </select>
                    </div>
                 </div>

                 <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Context</label>
                    <textarea [(ngModel)]="newDecision.context" rows="3" placeholder="What is the problem or opportunity?" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"></textarea>
                 </div>

                 <div *ngIf="newDecision.status === 'DECIDED'">
                    <label class="block text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">The Choice</label>
                    <textarea [(ngModel)]="newDecision.choice" rows="2" placeholder="What was decided?" class="w-full px-4 py-2.5 rounded-xl border border-indigo-100 bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"></textarea>
                 </div>

                 <div *ngIf="newDecision.status === 'DECIDED'">
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rationale</label>
                    <textarea [(ngModel)]="newDecision.rationale" rows="2" placeholder="Why this choice?" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"></textarea>
                 </div>
                 
                 <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                    <input type="text" placeholder="pivot, financial, strategy" (change)="updateTags($any($event).target.value)" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                 </div>
              </div>

              <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                 <button (click)="closeModal()" class="px-6 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 font-medium transition-colors">Cancel</button>
                 <button (click)="saveDecision()" 
                         [disabled]="!isValid()"
                         class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none">
                    Save Decision
                 </button>
              </div>
           </div>
        </div>

        <div class="relative pl-8 space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-slate-200 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          
          <div *ngFor="let decision of decisions$ | async" class="relative">
            
            <!-- Timeline Icon -->
            <div class="absolute -left-12 top-2 flex items-center justify-center h-10 w-10 rounded-full border-4 border-slate-50 shadow-sm"
                 [ngClass]="{
                   'bg-indigo-100 text-indigo-600': decision.impact === 'HIGH',
                   'bg-blue-50 text-blue-500': decision.impact === 'MEDIUM',
                   'bg-slate-100 text-slate-400': decision.impact === 'LOW'
                 }">
               <span class="text-xs font-bold">{{ decision.impact.charAt(0) }}</span>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                   <div class="flex items-center space-x-3 mb-1">
                      <h3 class="text-xl font-bold text-slate-900">{{ decision.title }}</h3>
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border"
                        [ngClass]="{
                          'bg-green-50 text-green-700 border-green-200': decision.status === 'DECIDED',
                          'bg-amber-50 text-amber-700 border-amber-200': decision.status === 'PENDING',
                          'bg-slate-50 text-slate-500 border-slate-200': decision.status === 'DRAFT',
                          'bg-stone-50 text-stone-500 border-stone-200': decision.status === 'ARCHIVED'
                        }">
                        {{ decision.status }}
                      </span>
                   </div>
                   <span class="text-sm text-slate-400 font-medium">{{ decision.date | date:'longDate' }}</span>
                </div>
                
                <div class="mt-4 sm:mt-0 flex space-x-2">
                  <span *ngFor="let tag of decision.tags" class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    #{{ tag }}
                  </span>
                </div>
              </div>

              <!-- AI Analysis Section for Pending Decisions -->
              <div *ngIf="decision.status === 'PENDING' || decision.status === 'DRAFT'" class="mb-6">
                 <div *ngIf="shouldShowAnalysis(decision.id)" class="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 mb-4 animate-fadeIn shadow-sm">
                    <div class="flex items-start">
                       <div class="mr-3 mt-0.5 text-indigo-600">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                       </div>
                       <div>
                          <h4 class="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-1">AI Recommendation</h4>
                          <p class="text-sm text-indigo-800 whitespace-pre-line">{{ getAnalysis(decision.id) }}</p>
                       </div>
                    </div>
                 </div>

                 <button *ngIf="!shouldShowAnalysis(decision.id)" 
                         (click)="analyzeDecision(decision.id, decision.context)"
                         class="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center transition-all group"
                         [disabled]="isAnalyzing(decision.id)">
                    <span *ngIf="!isAnalyzing(decision.id)" class="flex items-center">
                       <svg class="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                       Analyze Options with AI
                    </span>
                    <span *ngIf="isAnalyzing(decision.id)" class="flex items-center text-slate-500">
                       <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       Analyzing...
                    </span>
                 </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100">
                
                <div class="md:col-span-1">
                   <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Context</h4>
                   <p class="text-sm text-slate-600 leading-relaxed">{{ decision.context }}</p>
                </div>

                <div class="md:col-span-1">
                   <h4 class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">The Choice</h4>
                   <p class="text-sm font-medium text-slate-800 leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
                     {{ decision.choice || 'No choice recorded yet.' }}
                   </p>
                </div>

                <div class="md:col-span-1">
                   <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rationale</h4>
                   <p class="text-sm text-slate-600 leading-relaxed italic">
                     "{{ decision.rationale || 'No rationale recorded yet.' }}"
                   </p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class DecisionsPageComponent implements OnInit {
  decisions$!: Observable<Decision[]>;

  // Modal State
  isModalOpen = false;
  newDecision: Partial<Decision> = this.getEmptyDecision();

  // Simple local state for analysis results
  analysisResults: { [key: string]: string } = {};
  analyzingIds: { [key: string]: boolean } = {};

  constructor(
    private decisionsService: DecisionsService,
    private aiService: AiService
  ) { }

  ngOnInit(): void {
    this.loadDecisions();
  }

  loadDecisions() {
    this.decisions$ = this.decisionsService.getDecisions();
  }

  openModal() {
    this.isModalOpen = true;
    this.newDecision = this.getEmptyDecision();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getEmptyDecision(): Partial<Decision> {
    return {
      title: '',
      impact: 'MEDIUM',
      status: 'PENDING',
      context: '',
      choice: '',
      rationale: '',
      tags: [],
      date: new Date()
    };
  }

  updateTags(tagsStr: string) {
    this.newDecision.tags = tagsStr.split(',').map(t => t.trim()).filter(t => t !== '');
  }

  isValid(): boolean {
    return !!(this.newDecision.title && this.newDecision.context);
  }

  saveDecision() {
    if (!this.isValid()) return;

    this.decisionsService.createDecision(this.newDecision).subscribe(() => {
      this.loadDecisions();
      this.closeModal();
    });
  }

  analyzeDecision(id: string, context: string) {
    this.analyzingIds[id] = true;
    this.aiService.analyzeDecision(context).subscribe(result => {
      this.analysisResults[id] = result.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Simple markdown bold to HTML
      this.analyzingIds[id] = false;
    });
  }

  shouldShowAnalysis(id: string): boolean {
    return !!this.analysisResults[id];
  }

  getAnalysis(id: string): string {
    return this.analysisResults[id] || '';
  }

  isAnalyzing(id: string): boolean {
    return !!this.analyzingIds[id];
  }
}
