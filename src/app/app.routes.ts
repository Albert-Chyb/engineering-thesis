import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { LoginComponent } from '@authentication/pages/login/login.component';
import { PasswordRecoveryComponent } from '@authentication/pages/password-recovery/password-recovery.component';
import { SignupComponent } from '@authentication/pages/signup/signup.component';
import { requireSilentNavigationGuard } from '@common/route-guards/require-silent-navigation/require-silent-navigation.guard';
import { UnhandledErrorComponent } from '@presenting-errors/pages/unhandled-error/unhandled-error.component';
import { TestCreatorPageComponent } from './test-creator/pages/test-creator-page/test-creator-page.component';

function redirectLoggedInToHome() {
  return redirectLoggedInTo('/');
}

function redirectLoggedOutToLogin() {
  return redirectUnauthorizedTo('/login');
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
  {
    path: 'recover-password',
    component: PasswordRecoveryComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToHome,
    },
  },
  {
    path: 'test-creator',
    component: TestCreatorPageComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedOutToLogin,
    },
  },
  {
    path: 'error',
    component: UnhandledErrorComponent,
    canActivate: [requireSilentNavigationGuard],
  },
];
