import { useParams,usePathname } from 'next/navigation';
import Link from 'next/link';
import cn from 'clsx';

type UserNavLinkProps = {
  name: string;
  path: string;
};

export function UserNavLink({ name, path }: UserNavLinkProps): JSX.Element {
  const {
    ID
  } = useParams();
  console.log("showid param",ID);
  const asPath = usePathname();

  const userPath = `/profile/${ID as string}${path ? `/${path}` : ''}`;

  return (
    <Link href={userPath} scroll={false}  className='hover-animation main-tab dark-bg-tab flex flex-1 justify-center
                   hover:bg-light-primary/10 dark:hover:bg-dark-primary/10'
    >
        <div className='px-6 md:px-8'>
          <p
            className={cn(
              'flex flex-col gap-3 whitespace-nowrap pt-3 font-bold transition-colors duration-200',
              asPath === userPath
                ? 'text-light-primary dark:text-dark-primary [&>i]:scale-100 [&>i]:opacity-100'
                : 'text-light-secondary dark:text-dark-secondary'
            )}
          >
            {name}
            <i className='h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200' />
          </p>
        </div>
    </Link>
  );
}
