// src/app/components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { Category } from '../../models/category';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];
  loading: boolean = true;
  error: string = '';
  
  filterOptions = {
    status: 'all', // 'all', 'completed', 'active'
    categoryId: 0  // 0 means all categories
  };

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadCategories();
  }

  loadTasks(): void {
    this.loading = true; // Исправлено
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks';
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        // If categories fail to load, we can still show tasks
      }
    });
  }

  getCategoryName(categoryId: number | null): string {
    if (!categoryId) return 'Uncategorized';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  getCategoryColor(categoryId: number | null): string {
    if (!categoryId) return '#888888';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.color : '#888888';
  }

  deleteTask(id: number): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.applyFilters();
      },
      error: () => {
        this.error = 'Failed to delete task';
      }
    });
  }

  toggleTaskStatus(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    
    this.taskService.updateTask(updatedTask).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = response;
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Error updating task:', err);
        this.error = `Failed to update task status: ${err.status} ${err.statusText}`;
        if (err.error) {
          console.error('Error details:', err.error);
        }
      }
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      // Filter by status
      if (this.filterOptions.status === 'completed' && !task.completed) {
        return false;
      }
      if (this.filterOptions.status === 'active' && task.completed) {
        return false;
      }
      
      // Filter by category
      if (this.filterOptions.categoryId > 0 && task.category !== this.filterOptions.categoryId) {
        return false;
      }
      
      return true;
    });
  }

  onStatusFilterChange(status: string): void {
    this.filterOptions.status = status;
    this.applyFilters();
  }

  onCategoryFilterChange(categoryId: number): void {
    this.filterOptions.categoryId = categoryId;
    this.applyFilters();
  }
}