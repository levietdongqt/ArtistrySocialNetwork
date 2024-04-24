import type { Theme, Accent } from './theme';
import type { Timestamp } from 'firebase/firestore';

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
  coverImage: string | null;
  authProvider: string;
  userDetails: Map<string, any>;
  priorityScore: number;
  password: string;
  changePassword: boolean;
  theme: Theme;
  accent: Accent;
  bio: string;
  updateAt: string;
  verified: boolean;
  totalPost: number;
  totalPhotos: number;
  pinnedPost: string;
  roles: [];
  friendShipStatus: string;
};

export type EditableData = Extract<
  keyof User,
  'bio' | 'fullName' | 'avatar' | 'location' | 'coverImage'|'phoneNumber'|'dateOfBirth'
>;

export type EditableUserData = Pick<User, EditableData>;
