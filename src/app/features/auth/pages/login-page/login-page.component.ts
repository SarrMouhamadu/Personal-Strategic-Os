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
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div class="max-w-md w-full">
        <!-- Logo/Header -->
        <div class="text-center mb-10">
          <div class="inline-block bg-indigo-600 text-white p-3 rounded-2xl font-bold text-2xl shadow-lg mb-4">OS</div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Strategic OS</h1>
          <p class="text-slate-400 mt-2">Connectez-vous pour accéder à votre console de commandement.</p>
        </div>

        <!-- Auth Card -->
        <div class="bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div class="flex mb-8 bg-slate-900/50 p-1 rounded-xl">
            <button (click)="isLogin.set(true)" 
                    class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                    [ngClass]="isLogin() ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'">
              Connexion
            </button>
            <button (click)="isLogin.set(false)" 
                    class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                    [ngClass]="!isLogin() ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'">
              S'inscrire
            </button>
          </div>

          <form (submit)="onSubmit()" class="space-y-5">
            <div *ngIf="!isLogin()">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nom Complet</label>
              <input type="text" [(ngModel)]="name" name="name" required
                     class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required
                     class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Mot de Passe</label>
              <input type="password" [(ngModel)]="password" name="password" required
                     class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
            </div>

            <div *ngIf="errorMessage()" class="text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg border border-rose-400/20 animate-pulse">
              {{ errorMessage() }}
            </div>

            <button type="submit" [disabled]="loading()"
                    class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!loading()">{{ isLogin() ? 'Se Connecter' : 'Créer un Compte' }}</span>
              <span *ngIf="loading()">{{ isLogin() ? 'Connexion...' : 'Création...' }}</span>
            </button>
          </form>
        </div>

        <p class="text-center text-slate-500 mt-8 text-sm">
          &copy; 2025 Strategic OS. Sécurité par JWT & Bcrypt.
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
    name = '';

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
            this.authService.register({ email: this.email, password: this.password, name: this.name }).subscribe({
                next: (res) => {
                    if (res) {
                        this.isLogin.set(true);
                        this.errorMessage.set('Compte créé ! Connectez-vous.');
                    } else {
                        this.errorMessage.set('Erreur lors de la création du compte.');
                    }
                    this.loading.set(false);
                }
            });
        }
    }
}
