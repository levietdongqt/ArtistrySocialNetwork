'use client'
import { useParams, useRouter } from 'next/navigation';
import { UserContextProvider } from '../../../../context/user-context';
import { SEO } from '../common/seo';
import { MainContainer } from '../home/main-container';
import { MainHeader } from '../home/main-header';
import { UserHeader } from '../user/user-header';
import type { LayoutProps } from './common-layout';
import {User} from "@models/user";
import {Timestamp} from "firebase/firestore";

export function UserDataLayout({ children }: LayoutProps): JSX.Element {
  const {id} = useParams();
  const { back } = useRouter();
  /*const { data, loading } = useCollection(
    query(usersCollection, where('username', '==', id), limit(1)),
    { allowNull: true }
  );*/
  const a = () =>{}
  const loading = false;
 /* const user = data ? data[0] : null;*/
  const user:User = {
    id: '123',
    bio: 'asdasdasd',
    name: '',
    theme: null,
    accent: null,
    website: null,
    location: null,
    username: '',
    photoURL: '',
    verified: false,
    following: [],
    followers: [],
    createdAt: Timestamp.now(),
    updatedAt: null,
    totalTweets: 0,
    totalPhotos: 0,
    pinnedTweet: null,
    coverPhotoURL: null
  };
  return (
    <UserContextProvider value={{ user, loading }}>
      {!user && !loading && <SEO title='User not found / Social' />}
      <MainContainer>
        <MainHeader useActionButton action={back }>
          <UserHeader />
        </MainHeader>
        {children}
      </MainContainer>
    </UserContextProvider>
  );
}
