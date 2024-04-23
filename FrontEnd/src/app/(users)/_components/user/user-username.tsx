import Link from 'next/link';
import cn from 'clsx';

type UserUsernameProps = {
  id: string;
  username: string;
  className?: string;
  disableLink?: boolean;
};

export function UserUsername({
  id,
  username,
  className,
  disableLink
}: UserUsernameProps) {
  return (
    <Link href={`/user/${id}`} className={cn(
        'truncate text-light-secondary dark:text-dark-secondary',
        className,
        disableLink && 'pointer-events-none'
    )}
          tabIndex={-1}>
        @{username}
    </Link>
  );
}
