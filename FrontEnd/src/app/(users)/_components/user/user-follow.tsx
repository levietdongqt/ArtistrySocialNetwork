import { useUser } from '@lib/context/user-context';
import { SEO } from '../common/seo';
import { UserCards } from '../user/user-cards';


type UserFollowProps = {
  type: 'following' | 'followers';
};

export function UserFollow({ type }: UserFollowProps): JSX.Element {
  const { user } = useUser();
  /*const { name, username } = user as User;*/
  /*const { data, loading } = useCollection(
    query(
      usersCollection,
      where(
        type === 'following' ? 'followers' : 'following',
        'array-contains',
        user?.id
      )
    ),
    { allowNull: true }
  );*/
const loading = false;

  return (
    <>
      <SEO
        title={`People ${
          type === 'following' ? 'followed by' : 'following'
        } ${'name'} (@${'username'}) / Twitter`}
      />
      <UserCards follow data={[]} type={type} loading={loading} />
    </>
  );
}
