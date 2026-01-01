import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FinancialScenario {
  id: string;
  title: string;
  type: 'OPTIMISTIC' | 'REALISTIC' | 'PESSIMISTIC';
  revenueProjection: number;
  costProjection: number;
  riskScore: number;
  notes: string;
}

@Component({
  selector: 'app-financial-simulator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div class="container mx-auto max-w-6xl">
        
        <header class="mb-12">
          <h1 class="text-3xl font-bold text-slate-900">Financial Simulator</h1>
          <p class="text-slate-500 mt-2">Analysez vos risques et opportunités à travers différents scénarios.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div *ngFor="let scenario of scenarios" class="bg-white rounded-2xl p-8 shadow-sm border transition-all hover:shadow-lg"
               [ngClass]="{
                 'border-emerald-200 bg-emerald-50/10': scenario.type === 'OPTIMISTIC',
                 'border-blue-200 bg-blue-50/10': scenario.type === 'REALISTIC',
                 'border-orange-200 bg-orange-50/10': scenario.type === 'PESSIMISTIC'
               }">
            
            <div class="flex justify-between items-start mb-6">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                [ngClass]="{
                  'bg-emerald-100 text-emerald-700': scenario.type === 'OPTIMISTIC',
                  'bg-blue-100 text-blue-700': scenario.type === 'REALISTIC',
                  'bg-orange-100 text-orange-700': scenario.type === 'PESSIMISTIC'
                }">
                {{ scenario.type }}
              </span>
              <div class="text-xs font-mono text-slate-400">ID: {{ scenario.id }}</div>
            </div>

            <h2 class="text-xl font-bold text-slate-900 mb-2">{{ scenario.title }}</h2>
            <p class="text-slate-600 text-sm mb-6 h-10">{{ scenario.notes }}</p>

            <div class="space-y-4 mb-8">
              <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-500 text-sm">Revenue (Yearly)</span>
                <span class="font-bold text-slate-900">{{ scenario.revenueProjection | currency:'XOF':'symbol':'1.0-0' }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-500 text-sm">Costs (Yearly)</span>
                <span class="font-bold text-slate-700">-{{ scenario.costProjection | currency:'XOF':'symbol':'1.0-0' }}</span>
              </div>
              <div class="flex justify-between items-center p-3 rounded-lg border-t border-slate-200 mt-2">
                <span class="font-bold text-slate-900">Net Profit</span>
                <span class="font-bold text-lg" 
                      [ngClass]="(scenario.revenueProjection - scenario.costProjection) > 0 ? 'text-emerald-600' : 'text-red-600'">
                  {{ (scenario.revenueProjection - scenario.costProjection) | currency:'XOF':'symbol':'1.0-0' }}
                </span>
              </div>
            </div>

            <!-- Risk Meter -->
            <div>
              <div class="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Risk Score</span>
                <span>{{ scenario.riskScore }}/100</span>
              </div>
              <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" 
                     [style.width.%]="scenario.riskScore"
                     [ngClass]="{
                       'bg-emerald-500': scenario.riskScore < 30,
                       'bg-yellow-500': scenario.riskScore >= 30 && scenario.riskScore < 70,
                       'bg-red-500': scenario.riskScore >= 70
                     }">
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `
})
export class FinancialSimulatorComponent {
  scenarios: FinancialScenario[] = [
    {
      id: 's1',
      title: 'Bootstrapping Lean',
      type: 'PESSIMISTIC',
      revenueProjection: 0,
      costProjection: 0,
      riskScore: 20,
      notes: 'Croissance organique, pas de levée, dépenses minimales.'
    },
    {
      id: 's2',
      title: 'Fundraising Seed',
      type: 'OPTIMISTIC',
      revenueProjection: 0,
      costProjection: 0,
      riskScore: 85,
      notes: 'Levée de 500k pour accélération agressive avant revenu.'
    },
    {
      id: 's3',
      title: 'Consulting Hybrid',
      type: 'REALISTIC',
      revenueProjection: 0,
      costProjection: 0,
      riskScore: 40,
      notes: 'Financement du produit par des missions de freelance.'
    }
  ];
}
