import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityService } from '../../services/identity.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Profile, Role, Skill } from '../../../../core/models/profile.model';
import { Observable, take } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300" *ngIf="profile$ | async as profile">
      
      <!-- Profile Header / Hero -->
      <header class="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div class="container mx-auto px-6 py-12 lg:flex lg:items-center lg:justify-between">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-4">
               <h1 *ngIf="!isEditing" class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                 {{ profile.fullName }}
               </h1>
               <button *ngIf="!isEditing" (click)="startEditing(profile)" 
                       class="lg:hidden bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
               </button>
            </div>

            <div *ngIf="isEditing" [formGroup]="profileForm" class="space-y-4 max-w-xl">
               <input formControlName="fullName" class="text-4xl font-bold bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" placeholder="Full Name">
               <input formControlName="tagline" class="text-xl text-indigo-600 dark:text-indigo-400 font-medium bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Strategic Tagline">
               <textarea formControlName="bio" rows="3" class="text-lg text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Your professional bio..."></textarea>
            </div>

            <div *ngIf="!isEditing">
               <p class="text-xl text-indigo-600 dark:text-indigo-400 font-medium">
                 {{ profile.tagline }}
               </p>
               <p class="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                 {{ profile.bio }}
               </p>
            </div>
          </div>

          <div class="mt-8 lg:mt-0 lg:ml-8 flex flex-col items-center space-y-4">
             <div class="relative group">
                <div class="h-32 w-32 rounded-3xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-xl transition-transform hover:scale-105 overflow-hidden">
                   <img *ngIf="profile.avatarUrl" [src]="profile.avatarUrl" class="h-full w-full object-cover">
                   <span *ngIf="!profile.avatarUrl">{{ profile.fullName.charAt(0) }}</span>
                </div>
                
                <!-- Upload Overlay -->
                <label class="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-3xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                   <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   <input type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
                </label>
             </div>
             
             <div class="flex gap-2">
                <button *ngIf="!isEditing" (click)="startEditing(profile)" 
                        class="hidden lg:flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none">
                   <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                   Edit Profile
                </button>
                
                <ng-container *ngIf="isEditing">
                   <button (click)="cancelEdit()" class="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">
                      Cancel
                   </button>
                   <button (click)="saveProfile()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
                      Save Changes
                   </button>
                </ng-container>
             </div>
          </div>
        </div>
      </header>

      <main class="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <!-- Left Column: Skills & Stats -->
        <div class="lg:col-span-1 space-y-8">
          
          <section class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
            <div class="flex justify-between items-center mb-6">
               <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                 <span class="w-8 h-1 bg-indigo-500 rounded-full mr-3"></span>
                 Core Skills
               </h2>
               <button *ngIf="isEditing" (click)="addSkill()" class="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider hover:underline">+ Add Skill</button>
            </div>

            <div class="space-y-5" *ngIf="!isEditing">
              <div *ngFor="let skill of profile.skills">
                <div class="flex justify-between items-end mb-1">
                  <span class="font-medium text-slate-700 dark:text-slate-300">{{ skill.name }}</span>
                  <span class="text-xs text-slate-400 font-mono">{{ skill.level }}%</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full transition-all duration-1000" [style.width.%]="skill.level"></div>
                </div>
              </div>
            </div>

            <div class="space-y-4" *ngIf="isEditing" [formGroup]="profileForm">
               <div formArrayName="skills" class="space-y-3">
                  <div *ngFor="let skillGroup of skills.controls; let i = index" [formGroupName]="i" class="flex items-center gap-3">
                     <input formControlName="name" class="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm dark:text-white" placeholder="Skill Name">
                     <input formControlName="level" type="number" min="0" max="100" class="w-16 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm dark:text-white" placeholder="0-100">
                     <button (click)="removeSkill(i)" class="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-1.5 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                     </button>
                  </div>
               </div>
            </div>
          </section>

          <!-- BUS-02: Role Management UI -->
          <section class="bg-indigo-900 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative group transition-all hover:shadow-indigo-500/20">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
            <h2 class="text-lg font-bold mb-4 flex items-center">
               <svg class="w-5 h-5 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
               Strategic Role
            </h2>
            <p class="text-indigo-200 text-sm mb-6">Définissez votre niveau de visibilité et d'accès aux données.</p>
            
            <div class="space-y-3">
               <button *ngFor="let r of ['PRIVATE', 'PUBLIC', 'INVESTOR']"
                       (click)="updateRole(r)"
                       class="w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between group/btn"
                       [ngClass]="(authService.currentUser()?.role === r) ? 'bg-white text-indigo-900 border-white font-bold' : 'bg-white/10 border-white/10 hover:bg-white/20 text-indigo-100'">
                  <span>{{ r }}</span>
                  <svg *ngIf="authService.currentUser()?.role === r" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
               </button>
            </div>

            <div class="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
               <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-300">Session ID: {{ authService.currentUser()?.id?.substring(0,8) }}...</span>
               <button (click)="authService.logout()" class="text-xs font-bold text-rose-300 hover:text-rose-200 underline">Déconnexion</button>
            </div>
          </section>

        </div>

        <!-- Right Column: Career & Roles -->
        <div class="lg:col-span-2 space-y-8">
          
          <section>
            <div class="flex justify-between items-center mb-8">
               <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Career & Roles</h2>
               <button *ngIf="isEditing" (click)="addRole()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">+ Add Experience</button>
            </div>
            
            <div class="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-12 pb-8">
              
              <!-- View Mode Roles -->
              <ng-container *ngIf="!isEditing">
                <div *ngFor="let role of profile.roles" class="relative pl-8 sm:pl-12">
                  <div class="absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-slate-900 transition-colors" 
                       [ngClass]="role.current ? 'bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-900/20' : 'bg-slate-300 dark:bg-slate-700'">
                  </div>

                  <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ role.title }}</h3>
                        <div class="text-indigo-600 dark:text-indigo-400 font-medium">{{ role.company }}</div>
                        </div>
                        <div class="mt-2 sm:mt-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block shadow-sm"
                           [ngClass]="role.current ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'">
                        {{ role.startDate | date:'MMM yyyy' }} — {{ role.current ? 'Present' : (role.endDate | date:'MMM yyyy') }}
                        </div>
                    </div>
                    
                    <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed italic">{{ role.description }}</p>

                    <ul class="space-y-2.5">
                        <li *ngFor="let highlight of role.highlights" class="flex items-start text-sm text-slate-500 dark:text-slate-400">
                        <svg class="h-5 w-5 text-emerald-400 dark:text-emerald-500 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ highlight }}
                        </li>
                    </ul>
                  </div>
                </div>
              </ng-container>

              <!-- Edit Mode Roles -->
              <ng-container *ngIf="isEditing" [formGroup]="profileForm">
                <div formArrayName="roles">
                  <div *ngFor="let roleGroup of roles.controls; let i = index" [formGroupName]="i" class="relative pl-8 sm:pl-12 mb-12 last:mb-0">
                    <div class="absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-slate-900 transition-colors" 
                         [ngClass]="roleGroup.get('current')?.value ? 'bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-900/20' : 'bg-slate-300 dark:bg-slate-700'">
                    </div>

                    <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group relative">
                      <button (click)="removeRole(i)" class="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>

                      <div class="space-y-4">
                         <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input formControlName="title" class="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm dark:text-white" placeholder="Role Title">
                            <input formControlName="company" class="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm dark:text-white" placeholder="Company">
                         </div>
                         <textarea formControlName="description" rows="2" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm dark:text-white" placeholder="Describe your impact..."></textarea>
                         
                         <div class="flex items-center gap-4">
                            <label class="flex items-center cursor-pointer">
                               <input type="checkbox" formControlName="current" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-800 border-none">
                               <span class="ml-2 text-xs font-bold uppercase tracking-wider text-slate-500">Current Role</span>
                            </label>
                         </div>
                         
                         <div class="flex flex-wrap gap-2">
                            <div formArrayName="highlights" *ngFor="let h of getHighlights(i).controls; let hi = index" class="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg pl-3 pr-1 py-1">
                               <input [formControlName]="hi" class="bg-transparent border-none text-[11px] font-medium text-indigo-700 dark:text-indigo-300 w-32 focus:ring-0">
                               <button (click)="removeHighlight(i, hi)" class="text-indigo-400 hover:text-rose-500">
                                   <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                               </button>
                            </div>
                            <button (click)="addHighlight(i)" class="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">+ Add Highlight</button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ng-container>

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
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);

  isEditing = false;
  profileForm!: FormGroup;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profile$ = this.identityService.getProfile();
  }

  getSkillsArray(form: FormGroup): FormArray {
    return form.get('skills') as FormArray;
  }

  getRolesArray(form: FormGroup): FormArray {
    return form.get('roles') as FormArray;
  }

  startEditing(profile: Profile): void {
    this.initForm(profile);
    this.isEditing = true;
  }

  initForm(profile: Profile): void {
    this.profileForm = this.fb.group({
      fullName: [profile.fullName || '', Validators.required],
      tagline: [profile.tagline || ''],
      bio: [profile.bio || ''],
      skills: this.fb.array((profile.skills || []).map(s => this.createSkillGroup(s))),
      roles: this.fb.array((profile.roles || []).map(r => this.createRoleGroup(r)))
    });
  }

  // --- Skills Form Getters & Actions ---
  get skills() { return this.profileForm.get('skills') as FormArray; }

  createSkillGroup(skill?: Skill): FormGroup {
    return this.fb.group({
      name: [skill?.name || '', Validators.required],
      level: [skill?.level || 80, [Validators.min(0), Validators.max(100)]]
    });
  }

  addSkill(): void { this.skills.push(this.createSkillGroup()); }
  removeSkill(index: number): void { this.skills.removeAt(index); }

  // --- Roles Form Getters & Actions ---
  get roles() { return this.profileForm.get('roles') as FormArray; }

  createRoleGroup(role?: Role): FormGroup {
    return this.fb.group({
      title: [role?.title || '', Validators.required],
      company: [role?.company || ''],
      description: [role?.description || ''],
      startDate: [role?.startDate || new Date()],
      endDate: [role?.endDate || null],
      current: [role?.current || false],
      highlights: this.fb.array((role?.highlights || []).map(h => this.fb.control(h)))
    });
  }

  addRole(): void { this.roles.insert(0, this.createRoleGroup()); }
  removeRole(index: number): void { this.roles.removeAt(index); }

  getHighlights(roleIndex: number): FormArray {
    return this.roles.at(roleIndex).get('highlights') as FormArray;
  }

  addHighlight(roleIndex: number): void {
    this.getHighlights(roleIndex).push(this.fb.control('New achievement...'));
  }

  removeHighlight(roleIndex: number, hi: number): void {
    this.getHighlights(roleIndex).removeAt(hi);
  }

  // --- Save / Cancel ---
  cancelEdit(): void {
    this.isEditing = false;
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedProfile = {
        ...this.profileForm.value,
        id: 'user_profile_01' 
      };

      this.identityService.updateProfile(updatedProfile).pipe(take(1)).subscribe({
        next: () => {
          this.isEditing = false;
          this.loadProfile();
        },
        error: (err) => console.error('Save failed', err)
      });
    }
  }

  updateRole(role: string) {
    this.authService.updateRole(role).subscribe({
      next: () => this.loadProfile()
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La photo est trop lourde (Max 2Mo)');
        return;
      }

      this.identityService.uploadAvatar(file).subscribe({
        next: (res) => {
          this.loadProfile();
        },
        error: (err) => {
          console.error('Upload failed', err);
          alert('Erreur lors du téléchargement');
        }
      });
    }
  }
}
