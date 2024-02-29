import Link from 'next/link';
import cn from 'clsx';

type UserUsernameProps = {
  username: string;
  className?: string;
  disableLink?: boolean;
};

export function UserUsername({
  username,
  className,
  disableLink
}: UserUsernameProps) {
  return (
    <Link href={`/user/${username}`} className={cn(
        'truncate text-light-secondary dark:text-dark-secondary',
        className,
        disableLink && 'pointer-events-none'
    )}
          tabIndex={-1}>
        @{username}
    </Link>
  );
}
