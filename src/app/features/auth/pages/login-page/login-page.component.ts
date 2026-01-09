import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style="animation-delay: 1s;"></div>
      </div>

      <div class="max-w-md w-full relative z-10 animate-fade-in-up">
        <!-- Logo/Header -->
        <div class="text-center mb-10">
          <div class="inline-block bg-gradient-accent text-primary-800 p-4 rounded-2xl font-bold text-3xl shadow-accent mb-4 animate-bounce-subtle">OS</div>
          <h1 class="text-4xl font-extrabold text-white tracking-tight">Strategic OS</h1>
          <p class="text-accent-300 mt-3 text-lg">Votre centre de commandement personnel</p>
        </div>

        <!-- Auth Card -->
        <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-primary-lg border border-white/20 animate-scale-in">
          <div class="flex mb-8 bg-primary-900/30 p-1.5 rounded-xl">
            <button (click)="isLogin.set(true)" 
                    class="flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300"
                    [ngClass]="isLogin() ? 'bg-accent text-primary-800 shadow-accent transform scale-105' : 'text-accent-200 hover:text-white'">
              Connexion
            </button>
            <button (click)="isLogin.set(false)" 
                    class="flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300"
                    [ngClass]="!isLogin() ? 'bg-accent text-primary-800 shadow-accent transform scale-105' : 'text-accent-200 hover:text-white'">
              S'inscrire
            </button>
          </div>

          <form (submit)="onSubmit()" class="space-y-5">
            <div *ngIf="!isLogin()" class="flex gap-4 animate-fade-in-down">
              <div class="flex-1">
                <label class="block text-xs font-bold text-accent-200 uppercase tracking-widest mb-2 ml-1">Prénom</label>
                <input type="text" [(ngModel)]="firstName" name="firstName" required
                       class="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300">
              </div>
              <div class="flex-1">
                <label class="block text-xs font-bold text-accent-200 uppercase tracking-widest mb-2 ml-1">Nom</label>
                <input type="text" [(ngModel)]="lastName" name="lastName" required
                       class="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300">
              </div>
            </div>

            <div class="animate-fade-in-down" style="animation-delay: 0.1s;">
              <label class="block text-xs font-bold text-accent-200 uppercase tracking-widest mb-2 ml-1">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required
                     class="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300">
            </div>

            <div class="animate-fade-in-down" style="animation-delay: 0.2s;">
              <label class="block text-xs font-bold text-accent-200 uppercase tracking-widest mb-2 ml-1">Mot de Passe</label>
              <input type="password" [(ngModel)]="password" name="password" required
                     class="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300">
            </div>

            <div *ngIf="errorMessage()" class="text-accent-800 text-sm bg-accent/90 p-4 rounded-xl border-2 border-accent-400 animate-fade-in font-medium">
              {{ errorMessage() }}
            </div>

            <button type="submit" [disabled]="loading()"
                    class="w-full bg-gradient-accent hover:shadow-accent-lg text-primary-800 font-bold py-4 rounded-xl shadow-accent transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <span *ngIf="!loading()" class="flex items-center justify-center gap-2">
                {{ isLogin() ? 'Se Connecter' : 'Créer un Compte' }}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
              <span *ngIf="loading()" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLogin() ? 'Connexion...' : 'Création...' }}
              </span>
            </button>
          </form>
        </div>

        <p class="text-center text-accent-300/60 mt-8 text-sm">
          Développé et déployé par Mouhamadou Sarr <span class="block text-xs mt-1">sarrmahmoud232@gmail.com</span>
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = signal(true);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  email = '';
  password = '';
  firstName = '';
  lastName = '';

  onSubmit() {
    this.loading.set(true);
    this.errorMessage.set(null);

    if (this.isLogin()) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          if (res) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage.set('Identifiants invalides ou erreur serveur.');
            this.loading.set(false);
          }
        },
        error: () => {
          this.errorMessage.set('Une erreur est survenue.');
          this.loading.set(false);
        }
      });
    } else {
      this.authService.register({ 
        email: this.email, 
        password: this.password, 
        firstName: this.firstName, 
        lastName: this.lastName 
      }).subscribe({
        next: (res) => {
          this.isLogin.set(true);
          this.errorMessage.set('Compte créé ! Connectez-vous.');
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Erreur lors de la création du compte.');
          this.loading.set(false);
        }
      });
    }
  }
}
