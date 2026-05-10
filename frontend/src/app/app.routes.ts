import { Routes } from '@angular/router';
import { TaskListPage } from './features/tasks/pages/task-list-page/task-list-page';
import { LoginPage } from './features/auth/pages/login-page/login-page/login-page';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage, canActivate: [guestGuard], data: {hasAccount: true} },
    { path: 'signup', component: LoginPage, canActivate: [guestGuard], data: {hasAccount: false} },
    { path: 'tasks', component: TaskListPage, canActivate: [authGuard] }
];
