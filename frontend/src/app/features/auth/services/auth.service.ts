import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = 'http://localhost:8080/api';
    private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
    
    constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
        this.loadStoredUser();
    }

    private loadStoredUser(): void {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                this.currentUserSubject.next(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('currentUser');
            }
        }
    }

    

    signup(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/auth/signup`, user)
            .pipe(
                tap(user => {
                    this.router.navigate(['/login']);
                }),
                catchError(err => {
                    console.error('Signup error:', err);
                    throw err;
                })
            );
    }


    login(loginRequest: {email: String, password: String}): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/auth/login`, loginRequest)
            .pipe(
                tap(user => {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }),
                catchError(err => {
                    throw err;
                })
            );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['login']);
    }

    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
