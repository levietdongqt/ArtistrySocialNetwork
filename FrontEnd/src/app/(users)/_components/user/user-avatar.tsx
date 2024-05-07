import Link from 'next/link';
import cn from 'clsx';
import { NextImage } from '@components/ui/next-image';

type UserAvatarProps = {
  src: string;
  alt: string;
  size?: number;
  username?: string;
  className?: string;
  friend?: boolean;
};

export function UserAvatar({
  src,
  alt,
  size,
  username,
  className,
                             friend
}: UserAvatarProps): JSX.Element {
  const pictureSize = size ?? 48;

  return (
    <Link href={username ? `/profile/${username}` : '#'} className={cn(
        'blur-picture flex self-start mt-[0.938rem]',
        !username && 'pointer-events-none',
        className,
        {
          'mt-[0.938rem]' :friend
        }
    )}
          tabIndex={username ? 0 : -1}>
        <NextImage
          useSkeleton
          imgClassName='rounded-full'
          width={pictureSize}
          height={pictureSize}
          src={src}
          alt={alt}
          key={src}
        />
    </Link>
  );
}
