import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        authGuard = TestBed.inject(AuthGuard);
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should allow the authenticated user to access app', () => {
        authService.isLoggedIn.and.returnValue(true);

        expect(authGuard.canActivate()).toBe(true);
    });

    it('should navigate to login for unauthenticated user', () => {
        authService.isLoggedIn.and.returnValue(false);

        expect(authGuard.canActivate()).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
});
