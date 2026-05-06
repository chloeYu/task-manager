import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { catchError } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-task-modal',
  imports: [FormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css',
})
export class TaskModal implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() mode: 'create' | 'view' | 'edit' | undefined;
  @Input() task: Task | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  taskService: TaskService = inject(TaskService)

  taskFormModel: Task = this.createEmptyTask();

  constructor(private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.taskFormModel = { ...this.task };
    }

    if (changes['mode'] && this.mode === 'create') {
      this.taskFormModel = this.createEmptyTask();
    }
  }

  createEmptyTask(): Task {
    return {
      title: '',
      description: '',
      user: { id: this.authService?.getCurrentUser()?.id, name: 'test', email: 'test@test.com', password: '', role: 'USER' },
      status: 'TODO',
      priority: 'MEDIUM',
      createdAt: ''
    };
  }

  onClose() {
    this.close.emit();
  }

  onSubmit(taskForm: NgForm) {
    const saveOperation = this.mode === 'edit' && this.taskFormModel.id
      ? this.taskService.updateTask(this.taskFormModel)
      : this.taskService.createTask(this.taskFormModel);

    saveOperation.pipe(catchError(err => { console.log(err); return [] })).subscribe(() => {
      this.saved.emit();
    });
  }
}
