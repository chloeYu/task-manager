import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {form, FormField} from '@angular/forms/signals';
import { ActivatedRoute , Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model'
import { Login } from '../../../models/login.model';
import { Signup } from '../../../models/signup.model';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, CommonModule, RouterLink, FormField],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  loginModel = signal<Login>({
    email: '',
    password: ''
  });
  loginForm = form(this.loginModel);
  signupModel = signal<Signup>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  signupForm = form(this.signupModel);
  errorMessage: string = '';
  isLoading = signal(false);
  hasAccount: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Redirect to tasks if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }

    this.hasAccount = this.route.snapshot.data['hasAccount'];
  }

  passwordMismatch(): boolean {
    if(this.hasAccount) {
      return false;
    }

    const password = this.signupForm.password().value();
    const confirmPassword = this.signupForm.confirmPassword().value();
    if(!password || !confirmPassword) {
      return false;
    }
    
    return password !== confirmPassword;
  }

  onSubmit(loginForm: NgForm): void {
    if (this.passwordMismatch()) {
        this.errorMessage = 'Passwords do not match.';
        return;
    }
    if (loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage = '';

    if (this.hasAccount) {
      this.authService.login(this.loginForm().value()).subscribe({
        next: (authresponse) => {
          this.authService.currentUser.set({...authresponse});
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage = err?.error?.message || 'Login failed. Please check your credentials.';
          console.error('Login error:', err);
        }
      });
    } else {
      const user: User = {
        name: this.signupForm.name().value()?.trim() ?? '',
        password: this.signupForm.password().value()?.trim() ?? '',
        email: this.signupForm.email().value()?.trim() ?? '',
      };
      this.authService.signup(user).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage = err?.error?.message || 'Signup failed. Please try again.';
          console.error('Signup error:', err);
        }
      });
    }
  }
}
