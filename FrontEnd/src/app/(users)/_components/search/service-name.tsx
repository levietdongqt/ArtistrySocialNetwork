import cn from 'clsx';
import Link from 'next/link';
import { HeroIcon } from '@components/ui/hero-icon';

type UserNameProps = {
  tag?: keyof JSX.IntrinsicElements;
  id: number;
  name: string;
  username?: string;
  price?: number;
  className?: string;
  iconClassName?: string;
};

export function ServiceName({
  id,
  tag,
  name,
  price,
  username,
  className,
  iconClassName
}: UserNameProps): JSX.Element {
  const CustomTag = tag ? tag : 'p';

  return (
    <Link href={username ? `/user/${id}` : '#'}  className={cn(
        'flex items-center gap-1 truncate font-bold',
        username ? 'custom-underline' : 'pointer-events-none',
        className
    )}
          tabIndex={username ? 0 : -1}
    >

        
        <CustomTag className='truncate'>{name}</CustomTag>
         {"-"}
        <CustomTag className='truncate'>{price}$</CustomTag>
        <i>
            <HeroIcon
              className={cn('fill-accent-red', iconClassName ?? 'h-5 w-5')}
              iconName='CheckBadgeIcon'
              solid
            />
          </i>
        
    </Link>
  );
}
