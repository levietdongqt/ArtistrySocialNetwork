import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@lib/context/auth-context';
import { UserCard } from '../user/user-card';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { variants } from './aside-trends';

export function Suggestions(): JSX.Element {
  /*const { randomSeed } = useAuth();*/

  /*const { data: adminData, loading: adminLoading } = useDocument(
    doc(usersCollection, 'Twt0A27bx9YcG4vu3RTsR7ifJzf2'),
    { allowNull: true }
  );*/
  const adminData = null;
const suggestionsLoading = false;
const adminLoading = false;
  /*const { data: suggestionsData, loading: suggestionsLoading } = useCollection(
    query(
      usersCollection,
      where(documentId(), '>=', randomSeed),
      orderBy(documentId()),
      limit(2)
    ),
    { allowNull: true }
  );*/

  return (
    <section className='hover-animation rounded-2xl bg-main-sidebar-background'>
      {adminLoading || suggestionsLoading ? (
        <Loading className='flex h-52 items-center justify-center p-4' />
      ) : /*suggestionsData ?*/ (
        <motion.div className='inner:px-4 inner:py-3' {...variants}>
          <h2 className='text-xl font-bold'>Who to follow</h2>
          {adminData && <UserCard />}
          {/*{suggestionsData?.map((userData) => (*/}
            <UserCard key={'1'} />
          {/*))}*/}
          <Link href='/people' className='custom-button accent-tab hover-card block w-full rounded-2xl
                         rounded-t-none text-center text-main-accent'>
              Show more
          </Link>
        </motion.div>
      ) /*: (
        <Error />
      )*/}
    </section>
  );
}
