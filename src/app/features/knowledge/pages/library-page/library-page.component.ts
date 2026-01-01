import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { KnowledgeService } from '../../services/knowledge.service';
import { Resource } from '../../../../core/models/resource.model';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

@Component({
   selector: 'app-library-page',
   standalone: true,
   imports: [CommonModule, FormsModule, ReactiveFormsModule],
   template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div class="container mx-auto max-w-7xl">
        
        <header class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Knowledge Vault</h1>
            <p class="text-slate-500 mt-2">Votre second cerveau : Notes, Veille et Apprentissages.</p>
          </div>
          <button (click)="showModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center active:scale-95">
             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             Add Resource
          </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let resource of resources$ | async" 
               class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col h-full relative">
            
            <button (click)="deleteResource(resource.id)" class="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>

            <div class="flex justify-between items-start mb-4">
               <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-100 text-slate-500">
                  {{ resource.type }}
               </span>
            </div>

            <h3 class="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
               <a [href]="resource.url || '#'" target="_blank">{{ resource.title }}</a>
            </h3>
            
            <p class="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">{{ resource.summary }}</p>

            <div class="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
               <span>{{ resource.dateAdded | date:'mediumDate' }}</span>
               <span class="text-indigo-500 font-medium">{{ resource.status }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- New Resource Modal -->
    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-fadeIn">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 class="text-xl font-bold text-slate-900">Nouvelle Ressource</h3>
             <button (click)="showModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
          
          <form [formGroup]="resourceForm" (ngSubmit)="onSubmit()" class="p-6 space-y-5">
             <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Titre</label>
                <input type="text" formControlName="title" placeholder="ex: Guide Angular 17"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
             </div>
             
             <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Type</label>
                   <select formControlName="type" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                      <option value="ARTICLE">Article</option>
                      <option value="NOTE">Note</option>
                      <option value="BOOK">Livre</option>
                      <option value="TOOL">Outil</option>
                      <option value="COURSE">Cours</option>
                   </select>
                </div>
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Statut</label>
                   <select formControlName="status" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                      <option value="TO_PROCESS">À traiter</option>
                      <option value="PROCESSED">Traité</option>
                      <option value="ARCHIVED">Archivé</option>
                   </select>
                </div>
             </div>

             <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Lien (URL)</label>
                <input type="text" formControlName="url" placeholder="https://..."
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
             </div>

             <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Résumé / Notes</label>
                <textarea formControlName="summary" rows="3" placeholder="Résumé rapide..."
                          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"></textarea>
             </div>

             <div class="pt-4 flex gap-3">
                <button type="button" (click)="showModal = false" 
                        class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">Annuler</button>
                <button type="submit" [disabled]="resourceForm.invalid"
                        class="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none uppercase tracking-widest text-xs">
                    Créer la Ressource
                </button>
             </div>
          </form>
       </div>
    </div>
  `,
   styles: [`
    .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class LibraryPageComponent implements OnInit {
   private refreshSubject = new BehaviorSubject<void>(undefined);
   resources$!: Observable<Resource[]>;
   showModal = false;
   resourceForm: any;

   private fb = inject(FormBuilder);
   private knowledgeService = inject(KnowledgeService);

   constructor() {
      this.resourceForm = this.fb.group({
         title: ['', Validators.required],
         type: ['ARTICLE', Validators.required],
         summary: ['', Validators.required],
         url: [''],
         status: ['TO_PROCESS', Validators.required]
      });
   }

   ngOnInit(): void {
      this.resources$ = this.refreshSubject.pipe(
         switchMap(() => this.knowledgeService.getResources())
      );
   }

   onSubmit() {
      if (this.resourceForm.valid) {
         this.knowledgeService.createResource(this.resourceForm.value).subscribe({
            next: () => {
               this.showModal = false;
               this.resourceForm.reset({ type: 'ARTICLE', status: 'TO_PROCESS' });
               this.refreshSubject.next();
            },
            error: (err) => console.error('Failed to create resource', err)
         });
      }
   }

   deleteResource(id: string) {
      if (confirm('Supprimer cette ressource ?')) {
         this.knowledgeService.deleteResource(id).subscribe({
            next: () => this.refreshSubject.next(),
            error: (err) => console.error('Failed to delete resource', err)
         });
      }
   }
}
