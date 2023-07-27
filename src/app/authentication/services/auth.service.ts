import { Injectable, inject } from '@angular/core';
import {
  Auth,
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  linkWithCredential,
  reauthenticateWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { Observable, from, map, switchMap } from 'rxjs';
import { AppUser } from '../types/AppUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);

  readonly user$: Observable<AppUser | null> = user(this.auth).pipe(
    map((user) => this.createUserObject(user))
  );

  readonly isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map((user) => user !== null)
  );

  readonly uid$: Observable<string | null> = this.user$.pipe(
    map((user) => user?.uid ?? null)
  );

  createAccount(email: string, password: string): Observable<AppUser> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(map((credentials) => this.createUserObject(credentials.user)));
  }

  createAnonymousAccount(): Observable<AppUser> {
    return from(signInAnonymously(this.auth)).pipe(
      map((credentials) => this.createUserObject(credentials.user))
    );
  }

  convertAnonymousAccount(
    email: string,
    password: string
  ): Observable<AppUser> {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      throw new Error('The current user is not logged in');
    }

    if (!currentUser.isAnonymous) {
      throw new Error('The current user is not anonymous');
    }

    const credentials = EmailAuthProvider.credential(email, password);

    return from(linkWithCredential(currentUser, credentials)).pipe(
      map((credentials) => this.createUserObject(credentials.user))
    );
  }

  updateEmail(newEmail: string, password: string): Observable<AppUser> {
    return this.securitySensitiveUpdate(password, (currentUser) =>
      from(updateEmail(currentUser, newEmail))
    );
  }

  updatePassword(
    newPassword: string,
    oldPassword: string
  ): Observable<AppUser> {
    return this.securitySensitiveUpdate(oldPassword, (currentUser) =>
      from(updatePassword(currentUser, newPassword))
    );
  }

  updateName(newName: string): Observable<AppUser> {
    return this.currentUserUpdate((currentUser) =>
      from(updateProfile(currentUser, { displayName: newName }))
    );
  }

  updatePhotoURL(newPhotoURL: string): Observable<AppUser> {
    return this.currentUserUpdate((currentUser) =>
      from(updateProfile(currentUser, { photoURL: newPhotoURL }))
    );
  }

  signIn(email: string, password: string): Observable<AppUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((credentials) => this.createUserObject(credentials.user))
    );
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Method that performs an update of non-sensitive user information.
   * @param taskFactoryFn Method that returns an observable that performs the update.
   * @returns Observable that emits the updated user object.
   */
  private currentUserUpdate(
    taskFactoryFn: (currentUser: User) => Observable<void>
  ): Observable<AppUser> {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      throw new Error('The current user is not logged in');
    }

    return taskFactoryFn(currentUser).pipe(
      // The user observable does not emit a new value when the user object is updated.
      // Therefore, we need to manually emit a new value.
      switchMap(() => from(updateCurrentUser(this.auth, currentUser))),
      map(() => this.createUserObject(currentUser))
    );
  }

  /**
   * Method that performs an update of sensitive user information.
   * @param password Current password of the user.
   * @param taskFactoryFn Method that returns an observable that performs the update.
   * @returns Observable that emits the updated user object.
   */
  private securitySensitiveUpdate(
    password: string,
    taskFactoryFn: (currentUser: User) => Observable<void>
  ): Observable<AppUser> {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      throw new Error('The current user is not logged in');
    }

    if (!currentUser.email) {
      throw new Error('The current user does not have an email address');
    }

    const credentials = EmailAuthProvider.credential(
      currentUser.email,
      password
    );

    return from(reauthenticateWithCredential(currentUser, credentials)).pipe(
      switchMap((credentials) =>
        taskFactoryFn(credentials.user).pipe(map(() => credentials))
      ),
      map((credentials) => this.createUserObject(credentials.user))
    );
  }

  private createUserObject(user: User): AppUser;
  private createUserObject(user: null): null;
  private createUserObject(user: User | null): AppUser | null;
  private createUserObject(user: User | null): AppUser | null {
    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      isAnonymous: user.isAnonymous,
      creationTime:
        user.metadata.creationTime === undefined
          ? null
          : new Date(user.metadata.creationTime),
    };
  }
}
