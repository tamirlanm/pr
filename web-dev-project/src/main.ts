import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // Импортируем HttpClientModule
import { FormsModule } from '@angular/forms';  // Импортируем FormsModule

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // маршруты
    importProvidersFrom(FormsModule, HttpClientModule)  // Формы и HttpClient
  ]
});
