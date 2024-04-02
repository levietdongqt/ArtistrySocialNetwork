import type { Theme, Accent } from './theme';
import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';

export type User = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: boolean;
  dateOfBirth: string;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  createDate: string;
  status: string;
  location: Map<string, any>;
  avatar: string;
  coverImage: string;
  authProvider: string;
  userDetails: Map<string, any>;
  priorityScore: number;
  password: string;
  changePassword: boolean;
  searchHistory: string[];
  theme: Theme;
  accent: Accent;
  bio: string;
  updateAt: string;
  verified: boolean;
  totalPost: number;
  totalPhotos: number;
  pinnedPost: string;
  roles: [];
};

export type EditableData = Extract<
  keyof User,
  'bio' | 'name' | 'website' | 'photoURL' | 'location' | 'coverPhotoURL'
>;

export type EditableUserData = Pick<User, EditableData>;

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user) {
    return { ...user };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return { ...data } as User;
  }
};
