import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex flex-col min-h-screen transition-colors duration-300">
      <!-- Navigation Bar -->
      <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div class="container mx-auto px-12 h-16 flex items-center justify-between">
          
          <div class="flex items-center space-x-3">
            <div class="bg-indigo-600 text-white p-1.5 rounded-lg font-bold">OS</div>
            <span class="font-bold text-slate-800 dark:text-white text-lg tracking-tight">Personal Strategic OS</span>
          </div>

          <div class="flex items-center space-x-1 text-sm font-medium">
            <a routerLink="/dashboard" 
               routerLinkActive="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" 
               class="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
               Dashboard
            </a>
            <a routerLink="/projects" 
               routerLinkActive="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
               class="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
               Pipeline
            </a>
            <a routerLink="/goals" 
               routerLinkActive="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
               class="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
               Objectives
            </a>
            <a routerLink="/network" 
               routerLinkActive="bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" 
               class="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 transition-all">
               Network
            </a>
            
            <div class="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-3"></div>
            
            <button (click)="themeService.toggleTheme()" 
                    class="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-all active:scale-95"
                    [title]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <svg *ngIf="!themeService.isDarkMode()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              <svg *ngIf="themeService.isDarkMode()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.364 6.364l-.707-.707m12.728 0l-.707.707M6.364 18.364l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </button>

            <a routerLink="/identity" 
               routerLinkActive="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" 
               class="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
               Profile
            </a>
          </div>

        </div>
      </nav>

      <!-- Main Content Container -->
      <main class="flex-grow bg-slate-50 dark:bg-slate-950 transition-colors">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('personal-strategic-os');
  protected themeService = inject(ThemeService);
}
