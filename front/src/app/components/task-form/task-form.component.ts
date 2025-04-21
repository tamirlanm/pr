// src/app/components/task-form/task-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  categories: Category[] = [];
  isEditMode: boolean = false;
  taskId: number | null = null;
  loading: boolean = false;
  error: string = '';
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      category: [null],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    // Check if we're editing an existing task
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.error = 'Failed to load categories';
      }
    });
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          category: task.category,
          completed: task.completed
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load task';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;
    
    if (this.isEditMode && this.taskId) {
      // Update existing task
      const task: Task = {
        ...this.taskForm.value,
        id: this.taskId,
        owner: 1 // This might come from a user service in a real app
      };
      
      this.taskService.updateTask(task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.error = 'Failed to update task';
          this.loading = false;
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.error = 'Failed to create task';
          this.loading = false;
        }
      });
    }
  }
  
  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}