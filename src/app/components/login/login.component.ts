import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatError,
    MatCardModule,
  ],
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  hidePassword: WritableSignal<boolean> = signal(true);

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage = '';

  togglePasswordVisibility(): void {
  this.hidePassword.set(!this.hidePassword());
}

  loginFn(): void {
    if (this.form.valid) {
      const { username, password } = this.form.value;

      if (this.authService.login(username, password)) {
        this.router.navigate(['/facts']);
      } else {
        this.errorMessage = 'Invalid credentials!';
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
