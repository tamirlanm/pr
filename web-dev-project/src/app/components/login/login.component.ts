import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Для ngModel
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.access);  // Установи токен в localStorage
        this.router.navigate(['/tasks']);
      },
      error: () => alert('Login failed'),
    });
  }

  logout() {
    this.auth.logout();  // Вызови метод logout из AuthService
    this.router.navigate(['/login']);  // Перенаправление на страницу логина
  }
}
