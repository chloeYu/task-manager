import { HttpClient, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { catchError, tap, throwError } from "rxjs";
import { AuthService } from "../../features/auth/services/auth.service";
import { User } from "../../features/auth/models/user.model";
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from "../../../environments/environment";

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if(authService.isLoggedIn()) {
        return true;
    }
    return router.createUrlTree(['/login']);   
}

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if(authService.isLoggedIn()) {
    return router.createUrlTree(['/tasks']);
  }
  return true;
}

export const checkSession = () => {
  const http: HttpClient = inject(HttpClient);
  const authService = inject(AuthService);
  const router = inject(Router);

  return http.get<User>(`${environment.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      tap(user => {
        authService.currentUser.set(user);
      }),
      catchError(err => {
          authService.currentUser.set(null);
          router.navigate(['/login']);
          throw err;
      })
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  req = req.clone({
      withCredentials: true
    });
  

  return next(req).pipe(
    catchError(err => {
      const errorMessage = err?.error?.message || 'An unexpected error occurred';
      snackBar.open(errorMessage, 'Close', {
        duration: 5000,          // Show for 5 seconds
        panelClass: ['error-snackbar'], // Optional: Add CSS for red background
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      if (err.status === 401) {
        authService.currentUser.set(null);
        router.navigate(['/login']);
      }
      if (err.error.status === 500 && err.error.message.includes("JWT expired")) {
        authService.currentUser.set(null);
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};