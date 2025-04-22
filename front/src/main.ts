import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { tokenInterceptor } from './app/interceptors/token.interceptor';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TaskListComponent } from './app/components/task-list/task-list.component';
import { TaskFormComponent } from './app/components/task-form/task-form.component';
import { LoginComponent } from './app/components/login/login.component';
import { AuthGuard } from './app/guards/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideRouter([
      {path: '', redirectTo: '/tasks', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { 
        path: 'tasks', 
        component: TaskListComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'tasks/:id', 
        component: TaskFormComponent,
        canActivate: [AuthGuard]
      },
      { path: '**', redirectTo: '/tasks' }
    ])
  ]
}).catch(err => console.error('Error bootstrapping the application:', err));