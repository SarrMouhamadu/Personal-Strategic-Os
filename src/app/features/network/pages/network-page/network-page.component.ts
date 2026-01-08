import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NetworkService } from '../../services/network.service';
import { Contact } from '../../../../core/models/contact.model';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-network-page',
   standalone: true,
   imports: [CommonModule, RouterLink, FormsModule],
   template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div class="container mx-auto max-w-7xl">
        
        <header class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Strategic Network</h1>
            <p class="text-slate-500 mt-2">Gérez vos relations clés et transformez-les en opportunités.</p>
          </div>
          <div class="flex space-x-3">
             <button routerLink="/opportunities" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Pipeline
             </button>
             <button (click)="openModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Add Contact
             </button>
          </div>
        </header>

        <!-- New Contact Modal -->
        <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
           <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp">
              <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h2 class="text-xl font-bold text-slate-900">Add New Strategic Contact</h2>
                 <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
              </div>
              
              <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                        <input [(ngModel)]="newContact.name" type="text" placeholder="John Doe" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                        <input [(ngModel)]="newContact.email" type="email" placeholder="john@example.com" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                    </div>
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</label>
                        <input [(ngModel)]="newContact.role" type="text" placeholder="CTO, Angel Investor..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Company</label>
                        <input [(ngModel)]="newContact.company" type="text" placeholder="TechCorp" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                    </div>
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</label>
                        <input [(ngModel)]="newContact.location" type="text" placeholder="Paris, SF, Remote..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">LinkedIn URL</label>
                        <input [(ngModel)]="newContact.linkedin" type="text" placeholder="https://linkedin.com/in/..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                    </div>
                 </div>

                 <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Influence Level (1-10)</label>
                    <input [(ngModel)]="newContact.influenceLevel" type="number" min="1" max="10" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                 </div>
                 
                 <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                    <input type="text" placeholder="investor, mentor, tech" (change)="updateTags($any($event).target.value)" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                 </div>
              </div>

              <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                 <button (click)="closeModal()" class="px-6 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 font-medium transition-colors">Cancel</button>
                 <button (click)="saveContact()" 
                         [disabled]="!isValid()"
                         class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none">
                    Save Contact
                 </button>
              </div>
           </div>
        </div>

        <!-- Filters (Visual Placeholder) -->
        <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
           <button class="px-4 py-1.5 rounded-full bg-slate-800 text-white text-sm font-medium">All</button>
           <button class="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Investors</button>
           <button class="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Mentors</button>
           <button class="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Clients</button>
           <button class="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Talents</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div *ngFor="let contact of contacts$ | async" 
               [routerLink]="['/network', contact.id]"
               class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
            
            <div class="flex justify-between items-start mb-4">
               <div class="flex items-center">
                  <div class="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold mr-4 border border-indigo-100">
                     {{ contact.name.charAt(0) }}
                  </div>
                  <div>
                     <h3 class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{{ contact.name }}</h3>
                     <p class="text-sm text-slate-500">{{ contact.role }} @ {{ contact.company }}</p>
                  </div>
               </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-6">
               <span *ngFor="let tag of contact.tags" class="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                  {{ tag }}
               </span>
            </div>

            <div class="flex items-center text-sm text-slate-500 mb-2">
               <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               {{ contact.location || 'Remote' }}
            </div>

            <div class="flex items-center text-sm text-slate-500">
               <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               Last seen: {{ (contact.lastInteraction || contact.createdAt) | date:'mediumDate' }}
            </div>

          </div>

        </div>

      </div>
    </div>
  `
})
export class NetworkPageComponent implements OnInit {
   contacts$!: Observable<Contact[]>;

   // Modal State
   isModalOpen = false;
   newContact: Partial<Contact> = this.getEmptyContact();

   constructor(private networkService: NetworkService) { }

   ngOnInit(): void {
      this.loadContacts();
   }

   loadContacts() {
      this.contacts$ = this.networkService.getContacts();
   }

   openModal() {
      this.isModalOpen = true;
      this.newContact = this.getEmptyContact();
   }

   closeModal() {
      this.isModalOpen = false;
   }

   getEmptyContact(): Partial<Contact> {
      return {
         name: '',
         role: '',
         company: '',
         email: '',
         linkedin: '',
         location: '',
         influenceLevel: 5,
         tags: [],
         interactions: []
      };
   }

   updateTags(tagsStr: string) {
      this.newContact.tags = tagsStr.split(',').map(t => t.trim()).filter(t => t !== '');
   }

   isValid(): boolean {
      return !!(this.newContact.name && this.newContact.role && this.newContact.company);
   }

   saveContact() {
      if (!this.isValid()) return;

      this.networkService.createContact(this.newContact).subscribe(() => {
         this.loadContacts();
         this.closeModal();
      });
   }
}
