import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Auth } from '../models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<User | null>(null);
    isLoggedIn = computed(() => this.currentUser() !== null);
    
    constructor(private http: HttpClient, private router: Router) {
    }

    signup(user: User): Observable<User> {
        return this.http.post<User>(`${ environment.apiUrl}/auth/signup`, user)
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


    login(loginRequest: {email: string, password: string}): Observable<User> {
        return this.http.post<Auth>(`${environment.apiUrl}/auth/login`, loginRequest)
            .pipe(
                catchError(err => {
                    throw err;
                })
            );
    }

    logout(): void {
        this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
            next: () => {
                this.currentUser.set(null);
                this.router.navigate(['/login']);
            }
        });
    }
}
