// Updated task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/`);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}/`);
  }

  createTask(task: Partial<Task>): Observable<any> {
    // Match the structure expected by TaskCreateSerializer
    return this.http.post(`${this.apiUrl}/tasks/create/`, {
      title: task.title,
      description: task.description || '',
      category_id: task.category || null
    });
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${task.id}/`, {
      title: task.title,
      description: task.description,
      completed: task.completed,
      category_id: task.category
    });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}/`);
  }
}