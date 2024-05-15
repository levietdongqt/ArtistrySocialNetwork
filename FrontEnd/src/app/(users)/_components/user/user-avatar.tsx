import Link from 'next/link';
import cn from 'clsx';
import { NextImage } from '@components/ui/next-image';

type UserAvatarProps = {
  id?: string;
  src: string;
  alt: string;
  size?: number;
  username?: string;
  className?: string;
  friend?: boolean;
};

export function UserAvatar({
    id,
  src,
  alt,
  size,
  username,
  className,
  friend
}: UserAvatarProps): JSX.Element {
  const pictureSize = size ?? 48;

  return (
    <Link href={ id? `/profile/${id}` : '#'} className={cn(
        'blur-picture flex self-start',
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
