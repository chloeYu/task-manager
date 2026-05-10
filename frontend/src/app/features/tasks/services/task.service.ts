import { Injectable } from "@angular/core";
import { Task } from "../models/task.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
}
)
export class TaskService {
    constructor(private http: HttpClient, private authService: AuthService) { }

    fetchAllTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${environment.apiUrl}`)
            .pipe(catchError(err => {
                return of([]);
            }));
    }

    fetchTask(id: number): Observable<Task> {
        return this.http.get<Task>(`${environment.apiUrl}/${id}`)
            .pipe(catchError(err => {
                console.log("Error fetching task:", err);
                throw err;
            }));
    }

    createTask(task: Task) {
        console.log("creating a task", task);
        return this.http.post<Task>(environment.apiUrl, task);
    }

    updateTask(task: Task) {
        console.log("updating a task", task);
        return this.http.put<Task>(`${environment.apiUrl}/${task.id}`, task);
    }

    deleteTask(taskId: number) {
        console.log("deleting task", taskId);
        return this.http.delete<void>(`${environment.apiUrl}/${taskId}`);
    }
}