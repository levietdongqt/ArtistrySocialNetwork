import { useRouter } from 'next/router';
import { UserContextProvider } from '../../../../context/user-context';
import { SEO } from '../common/seo';
import { MainContainer } from '../home/main-container';
import { MainHeader } from '../home/main-header';
import { UserHeader } from '../user/user-header';
import type { LayoutProps } from './common-layout';

export function UserDataLayout({ children }: LayoutProps): JSX.Element {
  const {
    query: { id },
    back
  } = useRouter();

  /*const { data, loading } = useCollection(
    query(usersCollection, where('username', '==', id), limit(1)),
    { allowNull: true }
  );*/
  const loading = false;
 /* const user = data ? data[0] : null;*/
  const user = null;
  return (
    <UserContextProvider value={{ user, loading }}>
      {!user && !loading && <SEO title='User not found / Social' />}
      <MainContainer>
        <MainHeader useActionButton action={back}>
          <UserHeader />
        </MainHeader>
        {children}
      </MainContainer>
    </UserContextProvider>
  );
}
