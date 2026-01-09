import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService, Expense, StrategicSummary } from '../../services/finance.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors duration-300">
      <div class="container mx-auto max-w-7xl">
        
        <!-- Header -->
        <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analyse Stratégique Financière</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Gérez vos flux, optimisez vos dépenses et planifiez votre croissance.</p>
          </div>
          
          <button (click)="showAddForm.set(true)" 
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Nouvelle Dépense
          </button>
        </header>

        <!-- Summary Cards -->
        <div *ngIf="summary$ | async as summary" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
              <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Dépenses Réelles</span>
              <p class="text-3xl font-black text-slate-900 dark:text-white mt-1">{{ summary.totals.real | number:'1.0-2' }} FCFA</p>
           </div>
           <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
              <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Budget Prévu</span>
              <p class="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{{ summary.totals.planned | number:'1.0-2' }} FCFA</p>
           </div>
           <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
              <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Écart (Variance)</span>
              <p class="text-3xl font-black mt-1" [ngClass]="summary.totals.variance >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                {{ summary.totals.variance | number:'1.0-2' }}
              </p>
           </div>
           <div class="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all">
              <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-200">Optimisation</span>
              <p class="text-white font-medium mt-1 text-sm line-clamp-2">{{ summary.optimization[0] || 'Tout semble sous contrôle !' }}</p>
           </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <!-- Transactions List -->
           <div class="lg:col-span-2">
              <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                 <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white">Flux Récents</h2>
                    <span class="text-xs text-slate-400 dark:text-slate-500">Dernières transactions</span>
                 </div>
                 <div class="divide-y divide-slate-50 dark:divide-slate-800">
                    <div *ngFor="let exp of expenses$ | async" class="px-8 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between group">
                       <div class="flex items-center space-x-4">
                          <div class="p-3 rounded-2xl" [ngClass]="getCategoryClass(exp.category)">
                             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 8V7m0 1v1m0 0H7m5 0h5m-5 0v3m0 0H7m5 0h5"></path></svg>
                          </div>
                          <div>
                             <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">{{ exp.description }}</h4>
                             <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">{{ exp.date | date:'dd MMM yyyy' }} • {{ exp.category.replace('_', ' ') }}</p>
                          </div>
                       </div>
                       <div class="flex items-center space-x-6">
                          <div class="text-right">
                             <p class="text-sm font-black" [ngClass]="exp.isPlanned ? 'text-slate-400 italic' : 'text-slate-900 dark:text-white'">
                               {{ exp.amount | number:'1.0-2' }} FCFA
                             </p>
                             <span *ngIf="exp.isPlanned" class="text-[8px] uppercase font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">Budget Prévu</span>
                          </div>
                          <!-- Photo Link -->
                          <a *ngIf="exp.receiptUrl" [href]="exp.receiptUrl" target="_blank" class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors">
                             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                          </a>
                          <button (click)="onDelete(exp.id)" class="opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-500 transition-all">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Strategic Analytics Sidebar -->
           <div class="space-y-8">
              <div *ngIf="summary$ | async as summary" class="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
                 <div class="relative z-10">
                    <h3 class="text-xl font-bold mb-6">Optimisation Stratégique</h3>
                    <div class="space-y-6">
                       <div *ngFor="let opt of summary.optimization" class="flex items-start space-x-3">
                          <div class="mt-1 flex-shrink-0 bg-indigo-400/30 p-1 rounded-full">
                             <svg class="w-3 h-3 text-indigo-300" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                          </div>
                          <p class="text-sm text-indigo-100 leading-relaxed">{{ opt }}</p>
                       </div>
                    </div>
                 </div>
                 <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              </div>

              <!-- Categories Breakdown -->
              <div *ngIf="summary$ | async as summary" class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                 <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-6">Structure des Coûts</h3>
                 <div class="space-y-5">
                    <div *ngFor="let cat of getCategories(summary.categories)" class="space-y-2">
                       <div class="flex justify-between text-xs font-bold">
                          <span class="text-slate-400 uppercase tracking-widest">{{ cat.name }}</span>
                          <span class="text-slate-900 dark:text-white">{{ cat.value | number:'1.0-2' }} FCFA</span>
                       </div>
                       <div class="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div class="h-full rounded-full" [ngClass]="getCategoryBg(cat.name)" [style.width.%]="(cat.value / summary.totals.real) * 100"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <!-- Add Modal Overlay -->
      <div *ngIf="showAddForm()" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-zoom-in">
          <div class="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Nouvelle Dépense</h2>
            <button (click)="showAddForm.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <form class="p-10 space-y-6" (submit)="onSubmit()">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Description</label>
                <input [(ngModel)]="newExp.description" name="desc" class="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="Ex: Loyer, Marketing...">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Montant (FCFA)</label>
                <input [(ngModel)]="newExp.amount" name="amount" type="number" class="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="0.00">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Catégorie</label>
                <select [(ngModel)]="newExp.category" name="cat" class="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium">
                  <option value="FIXED">Fixe (Charges)</option>
                  <option value="VARIABLE">Variable (Opérationnel)</option>
                  <option value="EXCEPTIONAL">Exceptionnelle</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Fréquence</label>
                <select [(ngModel)]="newExp.frequency" name="freq" class="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium">
                  <option value="PUNCTUAL">Ponctuelle</option>
                  <option value="MONTHLY">Mensuelle</option>
                  <option value="QUARTERLY">Trimestrielle</option>
                  <option value="ANNUAL">Annuelle</option>
                </select>
              </div>
            </div>

            <div class="flex items-center space-x-6">
               <label class="flex items-center cursor-pointer group">
                  <input type="checkbox" [(ngModel)]="newExp.isPlanned" name="planned" class="rounded-lg border-2 border-slate-200 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 w-5 h-5 transition-all">
                  <span class="ml-3 text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">C'est une dépense prévue (Budget)</span>
               </label>
            </div>

            <!-- Receipt Upload -->
            <div class="space-y-2">
               <label class="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Justificatif (Photo/Reçu)</label>
               <div class="flex items-center space-x-4">
                  <label class="flex-grow bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-8 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all flex flex-col items-center justify-center text-center">
                     <svg class="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                     <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ receiptFileName() || 'Cliquez pour uploader un reçu' }}</span>
                     <input type="file" (change)="onFileSelected($event)" class="hidden" accept="image/*">
                  </label>
               </div>
            </div>

            <button type="submit" 
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95">
              Enregistrer la Transaction
            </button>
          </form>
        </div>
      </div>

    </div>
  `
})
export class FinanceDashboardComponent implements OnInit {
  private financeService = inject(FinanceService);
  
  expenses$!: Observable<Expense[]>;
  summary$!: Observable<StrategicSummary>;
  
  showAddForm = signal(false);
  receiptFileName = signal<string | null>(null);
  private selectedFile: File | null = null;
  
  newExp: Partial<Expense> = {
    description: '',
    amount: undefined,
    category: 'VARIABLE',
    frequency: 'PUNCTUAL',
    isPlanned: false,
    date: new Date().toISOString()
  };

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.expenses$ = this.financeService.getExpenses();
    this.summary$ = this.financeService.getStrategicSummary();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.receiptFileName.set(file.name);
    }
  }

  async onSubmit() {
    if (!this.newExp.description || !this.newExp.amount) return;

    if (this.selectedFile) {
       const res = await this.financeService.uploadReceipt(this.selectedFile).toPromise();
       if (res) this.newExp.receiptUrl = res.url;
    }

    this.financeService.createExpense(this.newExp).subscribe(() => {
       this.showAddForm.set(false);
       this.refreshData();
       // Reset form
       this.newExp = { description: '', amount: undefined, category: 'VARIABLE', frequency: 'PUNCTUAL', isPlanned: false, date: new Date().toISOString() };
       this.selectedFile = null;
       this.receiptFileName.set(null);
    });
  }

  onDelete(id: string) {
    if (confirm('Supprimer cette dépense ?')) {
      this.financeService.deleteExpense(id).subscribe(() => this.refreshData());
    }
  }

  getCategoryClass(cat: string): string {
    if (cat === 'FIXED') return 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
    if (cat === 'VARIABLE') return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
    return 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400';
  }

  getCategories(cats: any) {
    return Object.entries(cats).map(([name, value]) => ({ name, value: value as number }));
  }

  getCategoryBg(name: string): string {
    if (name === 'FIXED') return 'bg-indigo-500';
    if (name === 'VARIABLE') return 'bg-amber-500';
    return 'bg-rose-500';
  }
}
