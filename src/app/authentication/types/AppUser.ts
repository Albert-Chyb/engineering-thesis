import { User } from '@angular/fire/auth';

export type AppUser = Pick<
  User,
  | 'displayName'
  | 'email'
  | 'emailVerified'
  | 'isAnonymous'
  | 'photoURL'
  | 'uid'
  | 'phoneNumber'
> & { creationTime: Date | null };
