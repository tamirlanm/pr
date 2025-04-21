import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { title: '', description: '', completed: false, category: 1 };

  constructor(
    private taskService: TaskService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((data) => (this.tasks = data));
  }

  addTask() {
    if (!this.newTask.title.trim()) return;
    this.taskService.createTask(this.newTask).subscribe(() => {
      this.newTask = { title: '', description: '', completed: false, category: 1 };
      this.loadTasks();
    });
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.taskService.updateTask(task.id!, task).subscribe();
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
