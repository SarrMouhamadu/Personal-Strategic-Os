import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent),
        canActivate: [authGuard]
    },
    {
        path: 'identity',
        loadComponent: () => import('./features/identity/pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
        canActivate: [authGuard]
    },
    {
        path: 'goals',
        loadComponent: () => import('./features/goals/pages/goals-dashboard/goals-dashboard.component').then(m => m.GoalsDashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'decisions',
        loadComponent: () => import('./features/decisions/pages/decisions-page/decisions-page.component').then(m => m.DecisionsPageComponent),
        canActivate: [authGuard]
    },
    {
        path: 'projects',
        loadComponent: () => import('./features/projects/pages/projects-list-page/projects-list-page.component').then(m => m.ProjectsListPageComponent),
        canActivate: [authGuard]
    },
    {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/pages/project-detail-page/project-detail-page.component').then(m => m.ProjectDetailPageComponent),
        canActivate: [authGuard]
    },
    {
        path: 'finance',
        loadComponent: () => import('./features/finance/pages/financial-simulator/financial-simulator.component').then(m => m.FinancialSimulatorComponent),
        canActivate: [authGuard]
    },
    {
        path: 'network',
        loadComponent: () => import('./features/network/pages/network-page/network-page.component').then(m => m.NetworkPageComponent),
        canActivate: [authGuard]
    },
    {
        path: 'network/:id',
        loadComponent: () => import('./features/network/pages/contact-detail-page/contact-detail-page.component').then(m => m.ContactDetailPageComponent),
        canActivate: [authGuard]
    },
    {
        path: 'opportunities',
        loadComponent: () => import('./features/network/pages/opportunities-pipeline/opportunities-pipeline.component').then(m => m.OpportunitiesPipelineComponent),
        canActivate: [authGuard]
    },
    {
        path: 'knowledge',
        loadComponent: () => import('./features/knowledge/pages/library-page/library-page.component').then(m => m.LibraryPageComponent),
        canActivate: [authGuard]
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
];
