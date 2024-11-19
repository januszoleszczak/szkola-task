import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component'; // Assuming it's a standalone component
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, BrowserAnimationsModule], // Import LoginComponent
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with username and password controls', () => {
    expect(component.form.contains('username')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
  });

  it('should make the username and password controls required', () => {
    const usernameControl = component.form.get('username');
    const passwordControl = component.form.get('password');

    if (usernameControl && passwordControl) {
      usernameControl.setValue('');
      passwordControl.setValue('');

      expect(usernameControl.valid).toBeFalsy();
      expect(passwordControl.valid).toBeFalsy();
    }
  });

  it('should mark all controls as touched if form is invalid', () => {
    component.form.setValue({ username: '', password: '' });
    component.loginFn();
    expect(component.form.get('username')?.touched).toBeTruthy();
    expect(component.form.get('password')?.touched).toBeTruthy();
  });

  it('should navigate on successful login', () => {
    authService.login.and.returnValue(true);
    component.form.setValue({ username: 'test', password: '1234' });
    component.loginFn();
    expect(authService.login).toHaveBeenCalledWith('test', '1234');
    expect(router.navigate).toHaveBeenCalledWith(['/cat-facts']);
  });
});
