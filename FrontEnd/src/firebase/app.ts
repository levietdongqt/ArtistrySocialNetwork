'use client'
import { initializeApp } from '@firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { isUsingEmulator } from '@lib/env';
import { getFirebaseConfig } from './config';
import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from '@firebase/app';
import type { FirebaseStorage } from 'firebase/storage';

type Firebase = {
  auth: Auth;
  storage: FirebaseStorage;
  firebaseApp: FirebaseApp;
};

function initialize(): Firebase {
  const firebaseApp = initializeApp(getFirebaseConfig());
  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  return { firebaseApp, auth, storage };
}

function connectToEmulator({
  auth,
  storage,
  firebaseApp
}: Firebase): Firebase {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectStorageEmulator(storage, 'localhost', 9199);
  return { firebaseApp, auth, storage }
}

export function getFirebase(): Firebase {
  const firebase = initialize();
  if (isUsingEmulator) return connectToEmulator(firebase);
  return firebase;
}

export const {auth, storage } = getFirebase();
