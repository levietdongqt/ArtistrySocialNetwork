import type { Theme, Accent } from './theme';
import type { Timestamp } from 'firebase/firestore';
import {UserRole} from "@lib/enum/UserRole";
import {date} from "yup";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string| null;
  gender: boolean;
  dateOfBirth: string | null;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  createDate: string;
  status: string;
  location: {
    latitude: string;
    longitude: string;
} | {} ;
  avatar: string;
  coverImage: string | null;
  authProvider: string;
  userDetails: Map<string, any>;
  priorityScore: number;
  password: string;
  changePassword: boolean;
  theme: Theme;
  accent: Accent;
  bio: string| null;
  updateAt: string;
  verified: boolean;
  totalPost: number;
  totalPhotos: number;
  pinnedPost: string;
  address:string| null;
  roles: UserRole[];
  friendShipStatus: string;
};

export type ChangePassDTO = {
  oldPass : string;
  newPass : string;
}

export type EditableData = Extract<
  keyof User,
    'id'|'bio' | 'fullName' | 'avatar' | 'location' | 'coverImage'|
    'phoneNumber'|'dateOfBirth'|'address'|'email'|'roles'|'gender'|'updateAt'
>;
export  type ProviderData = Extract<
keyof  User,
    'id'|'bio' | 'phoneNumber'|'roles'| 'location'|'address'
>;


export type EditableUserData = Pick<User, EditableData>;
export type EditableProviderData = Pick<User, ProviderData>;