import { Route } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AuthGuard } from './guards/auth.guard'; // Не забудь добавить AuthGuard

export const routes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [AuthGuard], // защита маршрута с помощью AuthGuard
  },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full', // указываем полный путь при редиректе
  },
  {
    path: '**',
    redirectTo: '/tasks', // Если страница не найдена, редирект на tasks
  }
];
