import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
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
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => {
        const firebaseAuth = getAuth();

        if (environment.useFirebaseEmulators) {
          const {
            host,
            auth: { port },
          } = environment.firebaseEmulatorsConfig;

          connectAuthEmulator(firebaseAuth, `${host}:${port}`, {
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
  ],
};
