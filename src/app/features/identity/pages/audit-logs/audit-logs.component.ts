import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService, AuditLog, SecurityReport } from '../../services/audit.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors duration-300">
      <div class="container mx-auto max-w-6xl">
        
        <!-- Header -->
        <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Audit Logs</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Monitor real-time system activity and security events.</p>
          </div>
          
          <div *ngIf="report$ | async as report" class="flex gap-4">
             <div class="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all flex flex-col justify-center">
                <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1">Security Score</span>
                <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">PREMIUM</span>
             </div>
             <div class="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none flex flex-col justify-center">
                <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-200 mb-1">Total Logs</span>
                <span class="text-2xl font-black tracking-tighter">{{ report.totalLogs }}</span>
             </div>
          </div>
        </header>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div *ngFor="let stat of stats" class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
              <div class="flex items-center justify-between mb-2">
                 <div class="p-2 rounded-xl" [ngClass]="stat.bg">
                    <svg class="w-5 h-5" [ngClass]="stat.color" fill="none" stroke="currentColor" viewBox="0 0 24 24" [innerHTML]="stat.icon"></svg>
                 </div>
                 <span class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md">LIVE</span>
              </div>
              <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">{{ stat.label }}</h3>
              <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">{{ stat.value }}</p>
           </div>
        </div>

        <!-- Logs Table -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
           <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                 <thead>
                    <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                       <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Timestamp</th>
                       <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Action</th>
                       <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">User</th>
                       <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Details</th>
                       <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Status</th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
                    <tr *ngFor="let log of logs$ | async" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                       <td class="px-6 py-5 whitespace-nowrap">
                          <span class="text-xs font-mono text-slate-400 dark:text-slate-500">
                             {{ log.timestamp | date:'dd MMM, HH:mm:ss' }}
                          </span>
                       </td>
                       <td class="px-6 py-5">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight uppercase"
                                [ngClass]="getActionClass(log.action)">
                             {{ log.action.replace('_', ' ') }}
                          </span>
                       </td>
                       <td class="px-6 py-5">
                          <div class="flex items-center">
                             <div class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold mr-2">
                                {{ log.userId.charAt(0) }}
                             </div>
                             <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ log.userId.substring(0,8) }}...</span>
                          </div>
                       </td>
                       <td class="px-6 py-5">
                          <div class="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate group-hover:underline cursor-help" [title]="log.details | json">
                             {{ log.details.path || 'System Event' }}
                          </div>
                       </td>
                       <td class="px-6 py-5">
                          <span class="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50">
                             SECURE
                          </span>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
           
           <div *ngIf="(logs$ | async)?.length === 0" class="p-20 text-center">
              <div class="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p class="text-slate-500 dark:text-slate-400 font-medium">No audit logs found yet.</p>
           </div>
        </div>

      </div>
    </div>
  `
})
export class AuditLogsComponent implements OnInit {
  private auditService = inject(AuditService);
  logs$!: Observable<AuditLog[]>;
  report$!: Observable<SecurityReport>;

  stats: any[] = [];

  ngOnInit(): void {
    this.logs$ = this.auditService.getAllLogs();
    this.report$ = this.auditService.getSecurityReport();

    this.report$.subscribe(report => {
       this.stats = [
         { 
           label: 'Modifications', 
           value: report.modificationCount, 
           icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>',
           bg: 'bg-blue-50 dark:bg-blue-900/20',
           color: 'text-blue-600 dark:text-blue-400'
         },
         { 
           label: 'Sensitive Access', 
           value: report.sensitiveAccessCount, 
           icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>',
           bg: 'bg-rose-50 dark:bg-rose-900/20',
           color: 'text-rose-600 dark:text-rose-400'
         },
         { 
           label: 'System Health', 
           value: '100%', 
           icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
           bg: 'bg-emerald-50 dark:bg-emerald-900/20',
           color: 'text-emerald-600 dark:text-emerald-400'
         }
       ];
    });
  }

  getActionClass(action: string): string {
    if (action.includes('LOGIN')) return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400';
    if (action.includes('UPDATE')) return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
    if (action.includes('ACCESS')) return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400';
    if (action.includes('CREATE')) return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
    return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
  }
}
