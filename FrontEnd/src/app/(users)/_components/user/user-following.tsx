import { useAuth } from '../../../../context/oauth2-context';

type UserFollowingProps = {
  userTargetId: string;
};

export function UserFollowing({
  userTargetId
}: UserFollowingProps): JSX.Element | null {
  return (
    <p className='rounded bg-main-search-background px-1 text-xs'>
      Follows you
    </p>
  );
}
