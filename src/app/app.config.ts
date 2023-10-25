import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';
import {
  connectStorageEmulator,
  getStorage,
  provideStorage,
} from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  RouteReuseStrategy,
  provideRouter,
  withRouterConfig,
} from '@angular/router';
import { AppErrorHandler } from '@common/classes/AppErrorHandler';
import { AppRouteReuseStrategy } from '@common/classes/app-route-reuse-strategy';
import { generateId } from '@common/helpers/generate-doc-id';
import { DOC_ID_GENERATOR } from '@common/injection-tokens/doc-id-generator';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: AppRouteReuseStrategy,
    },
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => {
        const firebaseAuth = getAuth();

        if (environment.useFirebaseEmulators) {
          const {
            host,
            auth: { port },
          } = environment.firebaseEmulatorsConfig;

          connectAuthEmulator(firebaseAuth, `http://${host}:${port}`, {
            disableWarnings: true,
          });
        }

        return firebaseAuth;
      }),
      provideFirestore(() => {
        const firestore = getFirestore();

        if (environment.useFirebaseEmulators) {
          const {
            host,
            firestore: { port },
          } = environment.firebaseEmulatorsConfig;

          connectFirestoreEmulator(firestore, host, port);
        }

        return firestore;
      }),
      provideFunctions(() => {
        const functions = getFunctions();

        if (environment.useFirebaseEmulators) {
          const {
            host,
            functions: { port },
          } = environment.firebaseEmulatorsConfig;

          connectFunctionsEmulator(functions, host, port);
        }

        return functions;
      }),
      provideStorage(() => {
        const storage = getStorage();

        if (environment.useFirebaseEmulators) {
          const {
            host,
            storage: { port },
          } = environment.firebaseEmulatorsConfig;

          connectStorageEmulator(storage, host, port);
        }

        return storage;
      }),
    ]),
    provideAnimations(),
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    {
      provide: DOC_ID_GENERATOR,
      deps: [Firestore],
      useFactory: (firestore: Firestore) => () => generateId(firestore),
    },
  ],
};
