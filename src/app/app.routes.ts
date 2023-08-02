import { AuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { LoginComponent, SignupComponent } from '@authentication/pages';

function redirectLoggedInToHome() {
  return redirectLoggedInTo('/');
}

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToHome,
    },
  },
];
