import { inject, Injectable } from "@angular/core";
import { Task } from "../models/task.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";

@Injectable({
    providedIn: 'root'
}
)
export class TaskService {
    private readonly apiUrl = 'http://localhost:8080/api/tasks';

    constructor(private http: HttpClient, private authService: AuthService) { }

    fetchAllTasks(): Observable<Task[]> {
        console.log("Fetching all tasks from API");
        return this.http.get<Task[]>(`${this.apiUrl}/user/` + this.authService.getCurrentUser()?.id)
            .pipe(catchError(err => {
                console.log("Error fetching tasks:", err);
                return of([]);
            }));
    }

    fetchTask(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${id}`)
            .pipe(catchError(err => {
                console.log("Error fetching task:", err);
                throw err;
            }));
    }

    createTask(task: Task) {
        console.log("creating a task", task);
        return this.http.post<Task>(this.apiUrl, task);
    }

    updateTask(task: Task) {
        console.log("updating a task", task);
        return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
    }

    deleteTask(taskId: number) {
        console.log("deleting task", taskId);
        return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
    }
}