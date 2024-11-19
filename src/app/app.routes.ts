import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { FactsComponent } from './components/facts/facts.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent  },
  { path: 'facts', component: FactsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
