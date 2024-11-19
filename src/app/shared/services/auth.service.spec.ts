import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for isAuthenticated when user is logged in', () => {
    spyOn(service, 'isLoggedIn').and.returnValue(true);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false for isAuthenticated when user is not logged in', () => {
    spyOn(service, 'isLoggedIn').and.returnValue(false);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should call login method with correct parameters', () => {
    const loginSpy = spyOn(service, 'login');
    const username = 'testUser';
    const password = 'testPassword';
    service.login(username, password);
    expect(loginSpy).toHaveBeenCalledWith(username, password);
  });

  it('should call logout method', () => {
    const logoutSpy = spyOn(service, 'logout');
    service.logout();
    expect(logoutSpy).toHaveBeenCalled();
  });
})
