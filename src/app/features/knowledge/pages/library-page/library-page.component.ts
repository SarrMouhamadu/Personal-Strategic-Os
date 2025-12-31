import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeService } from '../../services/knowledge.service';
import { Resource } from '../../../../core/models/resource.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-library-page',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div class="container mx-auto max-w-7xl">
        
        <header class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Knowledge Vault</h1>
            <p class="text-slate-500 mt-2">Votre second cerveau : Notes, Veille et Apprentissages.</p>
          </div>
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             Add Resource
          </button>
        </header>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3 mb-8">
           <button class="px-4 py-1.5 rounded-full bg-slate-800 text-white text-sm font-medium">All</button>
           <button class="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Notes</button>
           <button class="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Articles</button>
           <button class="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Tools</button>
           <button class="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Books</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div *ngFor="let resource of resources$ | async" 
               class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col h-full">
            
            <div class="flex justify-between items-start mb-4">
               <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-100 text-slate-500">
                  {{ resource.type }}
               </span>
               <span *ngIf="resource.status === 'TO_PROCESS'" class="flex h-3 w-3 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </span>
            </div>

            <h3 class="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
               <a [href]="resource.url || '#'" target="_blank">{{ resource.title }}</a>
            </h3>
            
            <p class="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">{{ resource.summary }}</p>

            <div class="flex flex-wrap gap-2 mb-4">
               <span *ngFor="let tag of resource.tags" class="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  #{{ tag }}
               </span>
            </div>

            <div class="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
               <span>{{ resource.dateAdded | date:'mediumDate' }}</span>
               <div *ngIf="resource.projectId" class="flex items-center text-indigo-500 font-medium">
                  <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  Linked to Project
               </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `
})
export class LibraryPageComponent implements OnInit {
    resources$!: Observable<Resource[]>;

    constructor(private knowledgeService: KnowledgeService) { }

    ngOnInit(): void {
        this.resources$ = this.knowledgeService.getResources();
    }
}
