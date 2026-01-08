import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col min-h-screen">
      <!-- Navigation Bar -->
      <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div class="container mx-auto px-6 h-16 flex items-center justify-between">
          
          <div class="flex items-center space-x-3">
            <div class="bg-indigo-600 text-white p-1.5 rounded-lg font-bold">OS</div>
            <span class="font-bold text-slate-800 text-lg">Personal Strategic OS</span>
          </div>

          <div class="flex space-x-1 text-sm">
            <a routerLink="/dashboard" 
               routerLinkActive="bg-indigo-50 text-indigo-700 font-medium" 
               class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
               Dashboard
            </a>
            <a routerLink="/projects" 
               routerLinkActive="bg-purple-50 text-purple-700 font-medium" 
               class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-purple-600 transition-colors">
               Pipeline
            </a>
            <a routerLink="/goals" 
               routerLinkActive="bg-emerald-50 text-emerald-700 font-medium" 
               class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
               Objectives
            </a>
            <a routerLink="/network" 
               routerLinkActive="bg-pink-50 text-pink-700 font-medium" 
               class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-pink-600 transition-colors">
               Network
            </a>
            <div class="w-px h-6 bg-slate-200 mx-2 self-center"></div>
            <a routerLink="/identity" 
               routerLinkActive="bg-slate-100 text-slate-900 font-medium" 
               class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
               Profile
            </a>
          </div>

        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('personal-strategic-os');
}
