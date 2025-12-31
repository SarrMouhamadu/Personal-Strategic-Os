import { Routes } from '@angular/router';
import { ProfilePageComponent } from './features/identity/pages/profile-page/profile-page.component';
import { GoalsDashboardComponent } from './features/goals/pages/goals-dashboard/goals-dashboard.component';
import { DecisionsPageComponent } from './features/decisions/pages/decisions-page/decisions-page.component';
import { ProjectsListPageComponent } from './features/projects/pages/projects-list-page/projects-list-page.component';
import { ProjectDetailPageComponent } from './features/projects/pages/project-detail-page/project-detail-page.component';
import { FinancialSimulatorComponent } from './features/finance/pages/financial-simulator/financial-simulator.component';
import { NetworkPageComponent } from './features/network/pages/network-page/network-page.component';
import { ContactDetailPageComponent } from './features/network/pages/contact-detail-page/contact-detail-page.component';
import { OpportunitiesPipelineComponent } from './features/network/pages/opportunities-pipeline/opportunities-pipeline.component';
import { LibraryPageComponent } from './features/knowledge/pages/library-page/library-page.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent)
    },
    {
        path: 'identity',
        loadComponent: () => import('./features/identity/pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent)
    },
    {
        path: 'goals',
        loadComponent: () => import('./features/goals/pages/goals-dashboard/goals-dashboard.component').then(m => m.GoalsDashboardComponent)
    },
    {
        path: 'decisions',
        loadComponent: () => import('./features/decisions/pages/decisions-page/decisions-page.component').then(m => m.DecisionsPageComponent)
    },
    {
        path: 'projects',
        loadComponent: () => import('./features/projects/pages/projects-list-page/projects-list-page.component').then(m => m.ProjectsListPageComponent)
    },
    {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/pages/project-detail-page/project-detail-page.component').then(m => m.ProjectDetailPageComponent)
    },
    {
        path: 'finance',
        loadComponent: () => import('./features/finance/pages/financial-simulator/financial-simulator.component').then(m => m.FinancialSimulatorComponent)
    },
    {
        path: 'network',
        loadComponent: () => import('./features/network/pages/network-page/network-page.component').then(m => m.NetworkPageComponent)
    },
    {
        path: 'network/:id',
        loadComponent: () => import('./features/network/pages/contact-detail-page/contact-detail-page.component').then(m => m.ContactDetailPageComponent)
    },
    {
        path: 'opportunities',
        loadComponent: () => import('./features/network/pages/opportunities-pipeline/opportunities-pipeline.component').then(m => m.OpportunitiesPipelineComponent)
    },
    {
        path: 'knowledge',
        loadComponent: () => import('./features/knowledge/pages/library-page/library-page.component').then(m => m.LibraryPageComponent)
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
