import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityService } from '../../services/identity.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Profile } from '../../../../core/models/profile.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800" *ngIf="profile$ | async as profile">
      
      <!-- Hero Section -->
      <header class="bg-white shadow-sm border-b border-slate-200">
        <div class="container mx-auto px-6 py-12 lg:flex lg:items-center lg:justify-between">
          <div>
            <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {{ profile.fullName }}
            </h1>
            <p class="mt-4 text-xl text-indigo-600 font-medium">
              {{ profile.tagline }}
            </p>
            <p class="mt-4 max-w-2xl text-lg text-slate-600">
              {{ profile.bio }}
            </p>
          </div>
          <div class="mt-8 lg:mt-0 lg:ml-8 flex-shrink-0">
             <div class="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-lg">
                {{ profile.fullName.charAt(0) }}
             </div>
          </div>
        </div>
      </header>

      <main class="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <!-- Left Column: Skills & Stats -->
        <div class="lg:col-span-1 space-y-8">
          
          <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-6 flex items-center">
              <span class="w-8 h-1 bg-indigo-500 rounded-full mr-3"></span>
              Core Skills
            </h2>
            <div class="space-y-5">
              <div *ngFor="let skill of profile.skills">
                <div class="flex justify-between items-end mb-1">
                  <span class="font-medium text-slate-700">{{ skill.name }}</span>
                  <span class="text-xs text-slate-400 font-mono">{{ skill.level }}%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full transition-all duration-1000" [style.width.%]="skill.level"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- BUS-02: Role Management UI -->
          <section class="bg-indigo-900 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <h2 class="text-lg font-bold mb-4 flex items-center">
               <svg class="w-5 h-5 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
               Strategic Role
            </h2>
            <p class="text-indigo-200 text-sm mb-6">Définissez votre niveau de visibilité et d'accès aux données.</p>
            
            <div class="space-y-3">
               <button *ngFor="let r of ['PRIVATE', 'PUBLIC', 'INVESTOR']"
                       (click)="updateRole(r)"
                       class="w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between group"
                       [ngClass]="(authService.currentUser()?.role === r) ? 'bg-white text-indigo-900 border-white font-bold' : 'bg-white/10 border-white/10 hover:bg-white/20 text-indigo-100'">
                  <span>{{ r }}</span>
                  <svg *ngIf="authService.currentUser()?.role === r" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
               </button>
            </div>

            <div class="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
               <span class="text-xs text-indigo-300">Session ID: {{ authService.currentUser()?.id }}</span>
               <button (click)="authService.logout()" class="text-xs font-bold text-rose-300 hover:text-rose-200 underline">Déconnexion</button>
            </div>
          </section>

        </div>

        <!-- Right Column: Roles & Timeline -->
        <div class="lg:col-span-2 space-y-8">
          
          <section>
            <h2 class="text-2xl font-bold text-slate-900 mb-8">Career & Roles</h2>
            
            <div class="relative border-l-2 border-slate-200 ml-3 space-y-12">
              
              <div *ngFor="let role of profile.roles" class="relative pl-8 sm:pl-12">
                <!-- Timeline Dot -->
                <div class="absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white " 
                     [ngClass]="role.current ? 'bg-indigo-600 ring-4 ring-indigo-50' : 'bg-slate-300'">
                </div>

                <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div>
                      <h3 class="text-xl font-bold text-slate-900">{{ role.title }}</h3>
                      <div class="text-indigo-600 font-medium">{{ role.company }}</div>
                    </div>
                    <div class="mt-2 sm:mt-0 text-sm font-semibold px-3 py-1 rounded-full inline-block"
                         [ngClass]="role.current ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'">
                      {{ role.startDate | date:'MMM yyyy' }} - {{ role.current ? 'Present' : (role.endDate | date:'MMM yyyy') }}
                    </div>
                  </div>
                  
                  <p class="text-slate-600 mb-4">{{ role.description }}</p>

                  <ul class="space-y-2">
                    <li *ngFor="let highlight of role.highlights" class="flex items-start text-sm text-slate-500">
                      <svg class="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ highlight }}
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </section>

        </div>

      </main>
    </div>
  `
})
export class ProfilePageComponent implements OnInit {
  profile$!: Observable<Profile>;
  authService = inject(AuthService);

  constructor(private identityService: IdentityService) { }

  ngOnInit(): void {
    this.profile$ = this.identityService.getProfile();
  }

  updateRole(role: string) {
    this.authService.updateRole(role).subscribe();
  }
}
