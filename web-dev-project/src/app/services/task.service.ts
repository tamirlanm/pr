import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks/');
  }

  createTask(task: Task) {
    return this.http.post('/api/tasks/create/', task);
  }

  updateTask(id: number, task: Task) {
    return this.http.put(`/api/tasks/${id}/`, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`/api/tasks/${id}/`);
  }
}
