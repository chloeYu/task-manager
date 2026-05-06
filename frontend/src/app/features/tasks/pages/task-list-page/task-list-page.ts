import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskModal } from '../../components/task-modal/task-modal';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { AppLoading } from '../../../../shared/components/app-loading/app-loading';
import { HttpEvent } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-task-list-page',
  imports: [TaskModal, FormsModule, CommonModule, AppLoading],
  templateUrl: './task-list-page.html',
  styleUrl: './task-list-page.css',
})
export class TaskListPage implements OnInit {
  readonly isModalOpen = signal(false);
  readonly isLoading = signal(true);
  readonly mode = signal<'create' | 'view' | 'edit' | undefined>(undefined);
  readonly tasks = signal<Task[]>([]);
  readonly currentTask = signal<Task | undefined>(undefined);
  readonly status = signal<string | null>(null);
  readonly searchTerm = signal<string>('');
  readonly filteredTasks = computed<Task[]>(() => {
    if (this.status()) {
      return this.tasks().filter(task => task.status === this.status() && task.title.includes(this.searchTerm()));
    }
    return this.tasks().filter(task => task.title.includes(this.searchTerm()));
  });

  private readonly taskService = inject(TaskService);

  constructor(private authService: AuthService) {} 

  ngOnInit(): void {
    this.refreshTasks();
  }

  refreshTasks(): void {
    this.isLoading.set(true);
    this.taskService.fetchAllTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  openTaskModal(mode: 'create' | 'view' | 'edit', task?: Task) {
    this.mode.set(mode);
    this.currentTask.set(task ? { ...task } : undefined);
    this.isModalOpen.set(true);
  }

  closeTaskModal() {
    this.isModalOpen.set(false);
    this.currentTask.set(undefined);
  }

  onTaskSaved() {
    this.closeTaskModal();
    this.refreshTasks();
  }

  deleteTask(task: Task) {
    if (!task.id) return;
    if (!confirm(`Delete task "${task.title}"?`)) return;

    this.taskService.deleteTask(task.id).subscribe({
      next: () => this.refreshTasks(),
      error: (err) => console.error('Error deleting task', err),
    });
  }

  onStatusChange(event: Event) {
    this.status.set((event.target as HTMLSelectElement).value);
  }

  logout() {
    this.authService.logout();
  }
}
