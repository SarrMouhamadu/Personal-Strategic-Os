import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NetworkService } from '../../services/network.service';
import { Contact } from '../../../../core/models/contact.model';
import { Observable, switchMap } from 'rxjs';

@Component({
    selector: 'app-contact-detail-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-slate-50 text-slate-800" *ngIf="contact$ | async as contact">
      
      <!-- Hero -->
      <div class="bg-white border-b border-slate-200 shadow-sm">
        <div class="container mx-auto px-6 py-8">
           <div class="mb-6">
            <a routerLink="/network" class="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Back to Network
            </a>
          </div>

          <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
             <div class="flex items-center">
                <div class="h-20 w-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl font-bold mr-6 border border-indigo-100">
                   {{ contact.name.charAt(0) }}
                </div>
                <div>
                   <h1 class="text-3xl font-bold text-slate-900">{{ contact.name }}</h1>
                   <div class="text-lg text-slate-600">{{ contact.role }} @ {{ contact.company }}</div>
                   <div class="flex flex-wrap gap-2 mt-2">
                     <span *ngFor="let tag of contact.tags" class="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                        {{ tag }}
                     </span>
                   </div>
                </div>
             </div>
             <div class="mt-6 md:mt-0 flex gap-3">
                <button class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Edit Profile</button>
                <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Add Interaction</button>
             </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <!-- Left Column: Info -->
        <div class="space-y-8">
           <section class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 class="text-lg font-bold text-slate-900 mb-4">Contact Info</h2>
              <ul class="space-y-4">
                 <li class="flex items-center text-slate-600">
                    <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <a [href]="'mailto:' + contact.email" class="hover:text-indigo-600">{{ contact.email }}</a>
                 </li>
                 <li class="flex items-center text-slate-600">
                    <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {{ contact.location }}
                 </li>
                 <li class="flex items-center text-slate-600" *ngIf="contact.linkedInUrl">
                    <svg class="w-5 h-5 mr-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    <a [href]="contact.linkedInUrl" target="_blank" class="hover:text-indigo-600">LinkedIn Profile</a>
                 </li>
              </ul>
           </section>
        </div>

        <!-- Right Column: Timeline -->
        <div class="lg:col-span-2">
           <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center">
              Interaction History
              <span class="ml-3 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{{ contact.interactions.length }}</span>
           </h2>

           <div class="space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-200">
              
              <div *ngFor="let interaction of contact.interactions" class="relative pl-12">
                 <!-- Icon -->
                 <div class="absolute left-0 top-0 h-8 w-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-white z-10"
                      [ngClass]="{
                         'text-blue-500 bg-blue-50': interaction.type === 'EMAIL',
                         'text-green-500 bg-green-50': interaction.type === 'CALL',
                         'text-purple-500 bg-purple-50': interaction.type === 'MEETING' || interaction.type === 'LUNCH'
                      }">
                    <svg *ngIf="interaction.type === 'EMAIL'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <svg *ngIf="interaction.type === 'CALL'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <svg *ngIf="interaction.type === 'MEETING' || interaction.type === 'LUNCH'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                 </div>

                 <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div class="flex justify-between items-baseline mb-2">
                       <h3 class="font-bold text-slate-800 capitalize">{{ interaction.type.toLowerCase() }}</h3>
                       <span class="text-xs font-mono text-slate-400">{{ interaction.date | date:'mediumDate' }}</span>
                    </div>
                    <p class="text-slate-600">{{ interaction.notes }}</p>
                 </div>
              </div>

              <div *ngIf="contact.interactions.length === 0" class="pl-12">
                 <div class="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500">
                    No interactions recorded yet.
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  `
})
export class ContactDetailPageComponent implements OnInit {
    contact$!: Observable<Contact | undefined>;

    constructor(
        private route: ActivatedRoute,
        private networkService: NetworkService
    ) { }

    ngOnInit(): void {
        this.contact$ = this.route.paramMap.pipe(
            switchMap(params => {
                const id = params.get('id');
                if (id) {
                    return this.networkService.getContactById(id);
                }
                return new Observable<undefined>(sub => sub.next(undefined));
            })
        );
    }
}
