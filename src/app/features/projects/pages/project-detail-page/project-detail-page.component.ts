import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { AiService } from '../../../../core/services/ai.service';
import { KnowledgeService } from '../../../../features/knowledge/services/knowledge.service';
import { Project } from '../../../../core/models/project.model';
import { Scenario } from '../../../../core/models/scenario.model';
import { Resource } from '../../../../core/models/resource.model';
import { Observable, switchMap, map, shareReplay } from 'rxjs';
import { ScenariosService } from '../../services/scenarios.service';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-project-detail-page',
   standalone: true,
   imports: [CommonModule, RouterLink, FormsModule],
   template: `
    <div class="min-h-screen bg-slate-50 text-slate-800" *ngIf="project$ | async as project">
      
      <!-- Hero -->
      <div class="bg-white border-b border-slate-200 shadow-sm">
        <div class="container mx-auto px-6 py-8">
          <div class="mb-4">
            <a routerLink="/projects" class="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Back to Projects
            </a>
          </div>
          
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <div class="flex items-center space-x-4 mb-2">
                <h1 *ngIf="!isEditing" class="text-4xl font-bold text-slate-900">{{ project.name }}</h1>
                <input *ngIf="isEditing" [(ngModel)]="editData.name" class="text-4xl font-bold text-slate-900 bg-slate-50 border-b border-indigo-300 focus:outline-none focus:bg-white transition-all">
                
                <span *ngIf="!isEditing" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border"
                  [ngClass]="{
                    'bg-purple-50 text-purple-700 border-purple-200': project.status === 'DEPLOYED',
                    'bg-emerald-50 text-emerald-700 border-emerald-200': project.status === 'GROWTH',
                    'bg-amber-50 text-amber-700 border-amber-200': project.status === 'IDEATION',
                    'bg-blue-50 text-blue-700 border-blue-200': project.status === 'BUILD',
                    'bg-slate-50 text-slate-500 border-slate-200': project.status === 'ARCHIVED'
                  }">
                  {{ project.status }}
                </span>

                <select *ngIf="isEditing" [(ngModel)]="editData.status" class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200 focus:outline-none">
                   <option value="IDEATION">IDEATION</option>
                   <option value="BUILD">BUILD</option>
                   <option value="DEPLOYED">DEPLOYED</option>
                   <option value="GROWTH">GROWTH</option>
                </select>
              </div>
              <p class="text-xl text-slate-600 mb-2">{{ project.tagline }}</p>

              <!-- US-19: Access Level Badge -->
              <div class="flex items-center text-sm font-medium" 
                   [ngClass]="{
                      'text-slate-500': project.accessLevel === 'PRIVATE',
                      'text-indigo-600': project.accessLevel === 'TEAM',
                      'text-green-600': project.accessLevel === 'PUBLIC'
                   }">
                 <svg *ngIf="project.accessLevel === 'PRIVATE'" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                 <svg *ngIf="project.accessLevel === 'TEAM'" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                 <svg *ngIf="project.accessLevel === 'PUBLIC'" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 {{ project.accessLevel }} ACCESS
              </div>
            </div>
            
            <div class="mt-6 md:mt-0 flex space-x-3">
               <button *ngIf="!isEditing" (click)="generateSummary(project)" 
                       class="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center group"
                       [disabled]="isGeneratingSummary">
                  <span *ngIf="!isGeneratingSummary" class="mr-2 group-hover:scale-110 transition-transform">
                     <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </span>
                  <svg *ngIf="isGeneratingSummary" class="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {{ isGeneratingSummary ? 'Summarizing...' : 'AI Summary' }}
               </button>
               
               <button *ngIf="!isEditing" (click)="startEdit(project)" 
                       class="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors">
                  Edit
               </button>

               <button *ngIf="isEditing" (click)="saveEdit()" 
                       class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                       [disabled]="isSaving">
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
               </button>

               <button *ngIf="isEditing" (click)="cancelEdit()" 
                       class="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                  Cancel
               </button>

               <button *ngIf="!isEditing" (click)="archiveProject(project.id)" 
                       class="text-rose-600 hover:text-rose-700 font-medium px-4 py-2">
                  Archive
               </button>
            </div>
          </div>

          <!-- AI Summary Result Banner -->
          <div *ngIf="aiSummary" class="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl relative animate-fadeIn shadow-sm">
              <button (click)="aiSummary = null" class="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600 transition-colors">
                 <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <div class="flex">
                  <div class="flex-shrink-0 mr-3">
                      <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                         <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </div>
                  </div>
                  <div>
                      <h3 class="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-1">AI Executive Summary</h3>
                      <p class="text-indigo-800 whitespace-pre-line">{{ aiSummary }}</p>
                  </div>
              </div>
          </div>

          <!-- Tabs -->
          <div class="flex border-b border-slate-200">
             <button (click)="activeTab = 'OVERVIEW'" 
                     class="px-6 py-3 font-medium text-sm border-b-2 transition-all"
                     [ngClass]="activeTab === 'OVERVIEW' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'">
                Overview
             </button>
             <button (click)="activeTab = 'STRATEGY'" 
                     class="px-6 py-3 font-medium text-sm border-b-2 transition-all"
                     [ngClass]="activeTab === 'STRATEGY' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'">
                Strategy & Impact
             </button>
             <button (click)="activeTab = 'COMPLIANCE'" 
                     class="px-6 py-3 font-medium text-sm border-b-2 transition-all"
                     [ngClass]="activeTab === 'COMPLIANCE' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'">
                Compliance
             </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: OVERVIEW -->
      <div class="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12" *ngIf="activeTab === 'OVERVIEW'">
        
        <!-- Left: Vision & Info -->
        <div class="lg:col-span-2 space-y-12">
          
          <section class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Vision & Description</h2>
            <p *ngIf="!isEditing" class="text-slate-600 leading-relaxed text-lg">{{ project.description }}</p>
            <textarea *ngIf="isEditing" [(ngModel)]="editData.description" rows="5" class="w-full text-slate-600 leading-relaxed text-lg bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </section>

          <section>
            <h2 class="text-xl font-bold text-slate-900 mb-6">Execution Roadmap</h2>
            <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div class="space-y-8 relative before:absolute before:inset-y-0 before:left-2.5 before:w-0.5 before:bg-slate-200">
                
                <div *ngFor="let milestone of project.roadmap" class="relative pl-10 group">
                  <div class="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors"
                       [ngClass]="milestone.completed ? 'border-indigo-600 text-indigo-600' : 'border-slate-300 text-slate-300 group-hover:border-indigo-400'">
                     <svg *ngIf="milestone.completed" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  </div>

                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                    <div *ngIf="!isEditing" class="flex flex-col">
                       <h3 class="text-lg font-semibold transition-colors group-hover:text-indigo-900" 
                           [ngClass]="milestone.completed ? 'text-slate-800 line-through decoration-slate-300' : 'text-slate-900'">
                         {{ milestone.title }}
                       </h3>
                       <span class="text-sm font-mono text-slate-500">{{ milestone.date | date:'mediumDate' }}</span>
                    </div>
                    
                    <div *ngIf="isEditing" class="flex-grow flex gap-4 pr-4">
                       <input [(ngModel)]="milestone.title" class="flex-grow bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm">
                       <input type="checkbox" [(ngModel)]="milestone.completed" class="mt-2 h-4 w-4 text-indigo-600 rounded">
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>

        <!-- Right: Tech Stack & Metadata -->
        <div class="lg:col-span-1 space-y-8">
           
           <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <h2 class="text-lg font-bold text-slate-900 mb-4">Tech Stack</h2>
             <div class="flex flex-wrap gap-2">
                <span *ngFor="let tech of project.techStack" class="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
                  {{ tech }}
                </span>
             </div>
           </section>

           <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-slate-900">Key Documents</h2>
                <button *ngIf="isEditing" (click)="addDocument()" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">+ Add</button>
             </div>

             <div class="space-y-3">
                <div *ngFor="let doc of (isEditing ? editData.documents : (project.documents || [])); let i = index" 
                    class="relative flex items-center p-3 rounded-lg hover:bg-slate-50 border border-slate-100 group transition-all"
                    [ngClass]="{'bg-slate-50 border-indigo-100': isEditing}">
                   
                   <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mr-3 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                      <span class="font-bold text-xs">{{ doc.type?.substring(0,3) || '?' }}</span>
                   </div>
                   
                   <div class="flex-grow">
                      <div *ngIf="!isEditing">
                         <div class="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{{ doc.name }}</div>
                         <div class="text-xs text-slate-400 font-mono">{{ doc.type }}</div>
                      </div>
                      <div *ngIf="isEditing" class="flex flex-col gap-2 pr-6">
                         <input [(ngModel)]="doc.name" placeholder="Title" class="text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1">
                         <input [(ngModel)]="doc.url" placeholder="URL" class="text-[10px] bg-white border border-slate-200 rounded px-2 py-1">
                      </div>
                   </div>

                   <button *ngIf="isEditing" (click)="removeDocument(i)" class="absolute right-2 top-2 text-rose-400 hover:text-rose-600">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                </div>
             </div>
           </section>

           <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow" *ngIf="linkedResources$ | async as resources">
              <h2 class="text-lg font-bold text-slate-900 mb-4">Linked Knowledge</h2>
              <div *ngIf="resources.length === 0" class="text-sm text-slate-400 italic">No linked resources yet.</div>
              <div class="space-y-3">
                 <div *ngFor="let resource of resources" 
                      class="p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors bg-slate-50/50 group">
                    <div class="flex justify-between items-start mb-1">
                       <span class="text-[10px] font-bold uppercase text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">{{ resource.type }}</span>
                       <span class="text-xs text-slate-400">{{ resource.dateAdded | date:'shortDate' }}</span>
                    </div>
                    <a routerLink="/knowledge" class="font-medium text-slate-800 text-sm group-hover:text-indigo-600 line-clamp-2 mb-1 block transition-colors">{{ resource.title }}</a>
                    <div class="flex flex-wrap gap-1">
                       <span *ngFor="let tag of resource.tags" class="text-[10px] text-slate-500">#{{ tag }}</span>
                    </div>
                 </div>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 text-center">
                 <button class="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors">Add Learning Note</button>
              </div>
           </section>

        </div>
      </div>

      <!-- Tab Content: STRATEGY & IMPACT -->
      <div class="container mx-auto px-6 py-12" *ngIf="activeTab === 'STRATEGY'">
         
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div class="lg:col-span-2 space-y-12">

               <!-- Logiciel IA: Pitch Generator -->
               <section class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <div class="flex items-start justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold flex items-center">
                            <svg class="w-6 h-6 mr-3 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            AI Pitch Generator
                        </h2>
                        <p class="text-indigo-100 mt-2">Générez le pitch parfait adapté à votre interlocuteur en un clic.</p>
                    </div>
                  </div>

                  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div class="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                          <div class="flex-grow">
                              <label class="block text-sm font-medium text-indigo-100 mb-2">Target Audience</label>
                              <select [(ngModel)]="selectedAudience" class="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white transition-all cursor-pointer">
                                  <option value="INVESTOR" class="text-slate-900">Investor (Seed/Series A)</option>
                                  <option value="CLIENT" class="text-slate-900">Potential Client</option>
                                  <option value="PARTNER" class="text-slate-900">Strategic Partner</option>
                              </select>
                          </div>
                          <button (click)="generatePitch(project)" 
                                  class="bg-white text-indigo-700 font-bold px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center h-10 shadow-sm"
                                  [disabled]="isGeneratingPitch">
                              <span *ngIf="!isGeneratingPitch">Generate Pitch</span>
                              <span *ngIf="isGeneratingPitch">Writing...</span>
                          </button>
                      </div>

                      <div *ngIf="generatedPitch" class="bg-white rounded-lg p-4 text-slate-800 animate-fadeIn relative shadow-sm">
                          <p class="whitespace-pre-line leading-relaxed">{{ generatedPitch }}</p>
                          <div class="absolute top-2 right-2 flex gap-1">
                             <button class="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors" title="Copy">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                             </button>
                          </div>
                      </div>
                  </div>
               </section>

                <!-- Impact Scorecard -->
                <section class="mb-12">
                   <div class="flex justify-between items-center mb-6">
                      <h2 class="text-2xl font-bold text-slate-900">Impact Scorecard</h2>
                      <button *ngIf="isEditing" (click)="addImpactMetric()" class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">+ Add Impact Metric</button>
                   </div>
                   
                   <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div *ngFor="let metric of (isEditing ? editData.impact : project.impact); let i = index" class="relative group">
                            
                            <div *ngIf="!isEditing">
                               <div class="flex justify-between items-end mb-2">
                                  <span class="font-bold text-slate-700 text-sm tracking-wide group-hover:text-indigo-600 transition-colors">{{ metric.dimension }}</span>
                                  <span class="font-bold text-slate-900 text-lg">{{ metric.score }}/10</span>
                               </div>
                               <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                                  <div class="h-full rounded-full transition-all duration-500" 
                                       [style.width.%]="metric.score * 10"
                                       [ngClass]="{
                                          'bg-emerald-500': metric.dimension === 'ENVIRONMENTAL',
                                          'bg-blue-500': metric.dimension === 'SOCIAL',
                                          'bg-purple-500': metric.dimension === 'PERSONAL',
                                          'bg-indigo-500': metric.dimension === 'NETWORK'
                                       }">
                                  </div>
                               </div>
                               <p class="text-sm text-slate-500">{{ metric.description }}</p>
                            </div>

                            <div *ngIf="isEditing" class="space-y-3">
                               <div class="flex gap-2">
                                  <select [(ngModel)]="metric.dimension" class="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded px-2 py-1">
                                     <option value="PERSONAL">PERSONAL</option>
                                     <option value="NETWORK">NETWORK</option>
                                     <option value="SOCIAL">SOCIAL</option>
                                     <option value="ENVIRONMENTAL">ENVIRONMENTAL</option>
                                  </select>
                                  <input type="number" [(ngModel)]="metric.score" min="0" max="10" class="w-16 font-bold text-slate-900 bg-slate-50 border border-slate-100 rounded px-2 py-1">
                               </div>
                               <textarea [(ngModel)]="metric.description" placeholder="Description" rows="2" class="w-full text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded px-2 py-1"></textarea>
                               
                               <button (click)="removeImpactMetric(i)" class="absolute top-2 right-2 text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                               </button>
                            </div>

                         </div>
                      </div>
                   </div>
                </section>

               <!-- SWOT Matrix -->
               <section *ngIf="project.swot">
                  <h2 class="text-2xl font-bold text-slate-900 mb-6">SWOT Analysis</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     <div class="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 hover:shadow-md transition-shadow">
                        <h3 class="text-lg font-bold text-emerald-900 mb-4 flex items-center">
                           <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Strengths
                        </h3>
                        <ul class="space-y-2">
                           <li *ngFor="let item of project.swot.strengths" class="flex items-start text-emerald-800">
                              <svg class="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                              {{ item }}
                           </li>
                        </ul>
                     </div>

                     <div class="bg-orange-50/50 rounded-2xl p-6 border border-orange-100 hover:shadow-md transition-shadow">
                        <h3 class="text-lg font-bold text-orange-900 mb-4 flex items-center">
                           <span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> Weaknesses
                        </h3>
                        <ul class="space-y-2">
                           <li *ngFor="let item of project.swot.weaknesses" class="flex items-start text-orange-800">
                              <svg class="w-5 h-5 mr-2 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                              {{ item }}
                           </li>
                        </ul>
                     </div>

                     <div class="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
                        <h3 class="text-lg font-bold text-blue-900 mb-4 flex items-center">
                           <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Opportunities
                        </h3>
                        <ul class="space-y-2">
                           <li *ngFor="let item of project.swot.opportunities" class="flex items-start text-blue-800">
                              <svg class="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                              {{ item }}
                           </li>
                        </ul>
                     </div>

                     <div class="bg-slate-100/50 rounded-2xl p-6 border border-slate-200">
                        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center">
                           <span class="w-2 h-2 rounded-full bg-slate-500 mr-2"></span> Threats
                        </h3>
                        <ul class="space-y-2">
                           <li *ngFor="let item of project.swot.threats" class="flex items-start text-slate-700">
                              <svg class="w-5 h-5 mr-2 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                              {{ item }}
                           </li>
                        </ul>
                     </div>

                  </div>
               </section>

           </div>

           <!-- Right: KPIs -->
           <div class="lg:col-span-1">
                <section class="mb-12 sticky top-6">
                    <div class="flex justify-between items-center mb-6">
                       <h2 class="text-xl font-bold text-slate-900">KPIs</h2>
                       <button *ngIf="isEditing" (click)="addKpi()" class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">+ Add KPI</button>
                    </div>
                    
                    <div class="space-y-4">
                       <div *ngFor="let kpi of (isEditing ? editData.kpis : (project.kpis || [])); let i = index" class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 relative group">
                          
                          <div *ngIf="!isEditing">
                             <div class="text-sm font-medium text-slate-500 mb-1">{{ kpi.label }}</div>
                             <div class="flex items-end justify-between">
                                <div class="text-3xl font-bold text-slate-900">{{ kpi.value }}</div>
                                <div class="flex items-center px-2 py-1 rounded text-xs font-bold"
                                     [ngClass]="{
                                        'bg-green-50 text-green-700': kpi.trend === 'UP',
                                        'bg-red-50 text-red-700': kpi.trend === 'DOWN',
                                        'bg-slate-50 text-slate-500': kpi.trend === 'STABLE'
                                     }">
                                   <span *ngIf="kpi.trend === 'UP'">↑</span>
                                   <span *ngIf="kpi.trend === 'DOWN'">↓</span>
                                   <span *ngIf="kpi.trend === 'STABLE'">→</span>
                                   <span class="ml-1">{{ kpi.trend }}</span>
                                </div>
                             </div>
                          </div>

                          <div *ngIf="isEditing" class="space-y-3">
                             <input [(ngModel)]="kpi.label" placeholder="Label" class="w-full text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded px-2 py-1">
                             <div class="flex gap-2">
                                <input [(ngModel)]="kpi.value" placeholder="Value" class="flex-grow text-xl font-bold text-slate-900 bg-slate-50 border border-slate-100 rounded px-2 py-1">
                                <select [(ngModel)]="kpi.trend" class="text-xs font-bold bg-slate-50 border border-slate-100 rounded px-1">
                                   <option value="UP">UP</option>
                                   <option value="DOWN">DOWN</option>
                                   <option value="STABLE">STABLE</option>
                                </select>
                             </div>
                             <button (click)="removeKpi(i)" class="absolute top-2 right-2 text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                          </div>
                       </div>
                    </div>
                 </section>

                <!-- BUS-11: Strategic Scenarios Comparison -->
                <section class="mt-12">
                   <div class="flex justify-between items-center mb-6">
                      <h2 class="text-2xl font-bold text-slate-900">Strategic Scenarios</h2>
                      <button (click)="showScenarioModal = true" class="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">
                         + New Scenario
                      </button>
                   </div>

                   <div *ngIf="scenarios$ | async as scenarios" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div *ngFor="let scenario of scenarios" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                         <div class="absolute top-0 right-0 p-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter"
                                  [ngClass]="{
                                     'bg-emerald-50 text-emerald-600 border border-emerald-100': scenario.riskLevel === 'LOW',
                                     'bg-amber-50 text-amber-600 border border-amber-100': scenario.riskLevel === 'MEDIUM',
                                     'bg-orange-50 text-orange-600 border border-orange-100': scenario.riskLevel === 'HIGH',
                                     'bg-rose-50 text-rose-600 border border-rose-100': scenario.riskLevel === 'CRITICAL'
                                  }">
                               {{ scenario.riskLevel }} RISK
                            </span>
                         </div>
                         
                         <h3 class="text-lg font-bold text-slate-900 mb-2">{{ scenario.name }}</h3>
                         <p class="text-sm text-slate-500 mb-4 line-clamp-2">{{ scenario.description }}</p>

                         <div class="space-y-4">
                            <div>
                               <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Assumptions</h4>
                               <ul class="text-xs text-slate-600 space-y-1">
                                  <li *ngFor="let a of scenario.assumptions" class="flex items-center">
                                     <span class="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span> {{ a }}
                                  </li>
                               </ul>
                            </div>
                         </div>

                         <div class="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span class="text-[10px] font-bold text-slate-400">{{ scenario.createdAt | date:'shortDate' }}</span>
                            <button (click)="deleteScenario(scenario.id)" class="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                         </div>
                      </div>
                      
                      <div *ngIf="scenarios.length === 0" class="md:col-span-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                         Aucun scénario stratégique défini. Explorez vos options.
                      </div>
                   </div>
                </section>

                <!-- Scenario Modal (Simplified for speed) -->
                <div *ngIf="showScenarioModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                   <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200">
                      <h3 class="text-xl font-bold text-slate-900 mb-4">Nouveau Scénario</h3>
                      <div class="space-y-4">
                         <input [(ngModel)]="newScenario.name" placeholder="Nom du scénario" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
                         <textarea [(ngModel)]="newScenario.description" placeholder="Description..." class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2" rows="3"></textarea>
                         <select [(ngModel)]="newScenario.riskLevel" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
                            <option value="LOW">LOW RISK</option>
                            <option value="MEDIUM">MEDIUM RISK</option>
                            <option value="HIGH">HIGH RISK</option>
                            <option value="CRITICAL">CRITICAL RISK</option>
                         </select>
                      </div>
                      <div class="flex gap-3 mt-6">
                         <button (click)="showScenarioModal = false" class="flex-1 py-2 rounded-lg border border-slate-200">Annuler</button>
                         <button (click)="submitScenario(project.id)" class="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-bold">Créer</button>
                      </div>
                   </div>
                </div>
           </div>
         </div>

      </div>

      <!-- Tab Content: COMPLIANCE (US-18) -->
      <div class="container mx-auto px-6 py-12" *ngIf="activeTab === 'COMPLIANCE'">
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 max-w-4xl mx-auto" *ngIf="project.compliance">
             
             <div class="flex justify-between items-start mb-8">
                <div>
                   <h2 class="text-2xl font-bold text-slate-900">GDPR Compliance Audit</h2>
                   <p class="text-slate-500 mt-1">Status of data protection and regulatory compliance.</p>
                </div>
                <span class="px-4 py-2 rounded-lg text-sm font-bold border"
                      [ngClass]="{
                        'bg-emerald-50 text-emerald-700 border-emerald-200': project.compliance.gdprStatus === 'COMPLIANT',
                        'bg-red-50 text-red-700 border-red-200': project.compliance.gdprStatus === 'NON_COMPLIANT',
                        'bg-amber-50 text-amber-700 border-amber-200': project.compliance.gdprStatus === 'PENDING_AUDIT'
                      }">
                   {{ project.compliance.gdprStatus.replace('_', ' ') }}
                </span>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                   <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Data Collected</h3>
                   <div class="flex flex-wrap gap-2">
                      <span *ngFor="let data of project.compliance.dataCollected" class="bg-slate-100 text-slate-700 px-3 py-1.5 rounded text-sm font-mono border border-slate-200">
                         {{ data }}
                      </span>
                   </div>
                </div>
                <div>
                   <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Audit Details</h3>
                   <div class="space-y-3">
                      <div class="flex justify-between py-2 border-b border-slate-50">
                         <span class="text-slate-600">Last Audit Date</span>
                         <span class="font-medium text-slate-900">{{ project.compliance.lastAuditDate ? (project.compliance.lastAuditDate | date:'mediumDate') : 'Never' }}</span>
                      </div>
                      <div class="flex justify-between py-2 border-b border-slate-50">
                         <span class="text-slate-600">DPO Contact</span>
                         <span class="font-medium text-slate-900">{{ project.compliance.dpoContact || 'Not assigned' }}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div class="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div class="flex items-start">
                   <svg class="w-6 h-6 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   <div>
                      <h4 class="font-bold text-blue-900 mb-2">Audit Log</h4>
                      <p class="text-sm text-blue-800">
                         This project is currently categorized as <strong>{{ project.accessLevel }}</strong>. 
                         Ensure that all sensitive data handling processes are documented before changing status to PUBLIC.
                      </p>
                   </div>
                </div>
             </div>

          </div>

          <div class="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center max-w-4xl mx-auto" *ngIf="!project.compliance">
              <svg class="h-16 w-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <h3 class="text-lg font-bold text-slate-900 mb-2">No Compliance Data</h3>
              <p class="text-slate-500">This project has not been audited yet.</p>
          </div>
      </div>

    </div>
  `
})
export class ProjectDetailPageComponent implements OnInit {
   project$!: Observable<Project | undefined>;
   scenarios$!: Observable<Scenario[]>;
   linkedResources$!: Observable<Resource[]>;
   activeTab: 'OVERVIEW' | 'STRATEGY' | 'COMPLIANCE' = 'OVERVIEW';

   // Scenario State
   showScenarioModal = false;
   newScenario: Partial<Scenario> = { name: '', description: '', riskLevel: 'MEDIUM', assumptions: ['Assumption 1'], outcomes: ['Outcome 1'], status: 'DRAFT' };

   // AI State
   isGeneratingSummary = false;
   aiSummary: string | null = null;

   isGeneratingPitch = false;
   selectedAudience: 'INVESTOR' | 'CLIENT' | 'PARTNER' = 'INVESTOR';
   generatedPitch: string | null = null;

   // Edit State
   isEditing = false;
   isSaving = false;
   editData: any = {};

   private router = inject(Router);

   constructor(
      private route: ActivatedRoute,
      private projectsService: ProjectsService,
      private scenariosService: ScenariosService,
      private aiService: AiService,
      private knowledgeService: KnowledgeService
   ) { }

   ngOnInit(): void {
      const projectAndScenarios$ = this.route.paramMap.pipe(
         switchMap(params => {
            const id = params.get('id');
            if (id) {
               this.linkedResources$ = this.knowledgeService.getResourcesByProjectId(id);
               this.scenarios$ = this.scenariosService.getScenariosByProject(id).pipe(shareReplay(1));
               return this.projectsService.getProjectById(id);
            }
            return new Observable<undefined>(sub => sub.next(undefined));
         }),
         shareReplay(1)
      );
      this.project$ = projectAndScenarios$;
   }

   generateSummary(project: Project) {
      this.isGeneratingSummary = true;
      this.aiSummary = null;
      this.aiService.generateProjectSummary(project).subscribe(summary => {
         this.aiSummary = summary.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Simple markdown bold to HTML
         this.isGeneratingSummary = false;
      });
   }

   generatePitch(project: Project) {
      this.isGeneratingPitch = true;
      this.generatedPitch = null;
      this.aiService.generatePitch(project, this.selectedAudience).subscribe(pitch => {
         this.generatedPitch = pitch.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
         this.isGeneratingPitch = false;
      });
   }

   startEdit(project: Project) {
      this.isEditing = true;
      this.editData = { ...project };
   }

   cancelEdit() {
      this.isEditing = false;
   }

   saveEdit() {
      this.isSaving = true;
      this.projectsService.updateProject(this.editData.id, this.editData).subscribe({
         next: () => {
            this.isSaving = false;
            this.isEditing = false;
            this.ngOnInit(); // Reload
         },
         error: () => this.isSaving = false
      });
   }

   archiveProject(id: string) {
      if (confirm('Êtes-vous sûr de vouloir archiver ce projet ?')) {
         this.projectsService.archiveProject(id).subscribe(() => {
            this.router.navigate(['/projects']);
         });
      }
   }

   addDocument() {
      if (!this.editData.documents) this.editData.documents = [];
      this.editData.documents.push({ id: Date.now().toString(), name: 'New Doc', type: 'LINK', url: '' });
   }

   removeDocument(index: number) {
      this.editData.documents.splice(index, 1);
   }

   addKpi() {
      if (!this.editData.kpis) this.editData.kpis = [];
      this.editData.kpis.push({ id: Date.now().toString(), label: 'New KPI', value: '0', trend: 'STABLE', status: 'GOOD' });
   }

   removeKpi(index: number) {
      this.editData.kpis.splice(index, 1);
   }

   addImpactMetric() {
      if (!this.editData.impact) this.editData.impact = [];
      this.editData.impact.push({ dimension: 'PERSONAL', score: 5, description: 'New indicator', lastMeasured: new Date().toISOString().split('T')[0] });
   }

   removeImpactMetric(index: number) {
      this.editData.impact.splice(index, 1);
   }

   trackByIndex(index: number, item: any): any {
      return index;
   }

   submitScenario(projectId: string) {
      const scenarioToCreate = { ...this.newScenario, projectId };
      this.scenariosService.createScenario(scenarioToCreate).subscribe(() => {
         this.showScenarioModal = false;
         this.newScenario = { name: '', description: '', riskLevel: 'MEDIUM', assumptions: ['Assumption 1'], outcomes: ['Outcome 1'], status: 'DRAFT' };
         this.ngOnInit(); // Refresh
      });
   }

   deleteScenario(id: string) {
      if (confirm('Supprimer ce scénario ?')) {
         this.scenariosService.deleteScenario(id).subscribe(() => {
            this.ngOnInit(); // Refresh
         });
      }
   }
}
