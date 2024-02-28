import { doc, query, where } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '@lib/context/user-context';
import { mergeData } from '@lib/merge';
import { UserLayout, ProtectedLayout } from '../../_components/layout/common-layout';
import { MainLayout } from '../../_components/layout/main-layout';
import { UserDataLayout } from '../../_components/layout/user-data-layout';
import { UserHomeLayout } from '../../_components/layout/user-home-layout';
import { StatsEmpty } from '../../_components/tweet/stats-empty';
import { Loading } from '@components/ui/loading';
import { Tweet } from '../../_components/tweet/tweet';
import type { ReactElement, ReactNode } from 'react';

export default function UserTweets() {
  const { user } = useUser();

  const { id, username, pinnedTweet } = user ?? {};

  const { data: pinnedData } = useDocument(
    doc(tweetsCollection, pinnedTweet ?? 'null'),
    {
      disabled: !pinnedTweet,
      allowNull: true,
      includeUser: true
    }
  );

  const { data: ownerTweets, loading: ownerLoading } = useCollection(
    query(
      tweetsCollection,
      where('createdBy', '==', id),
      where('parent', '==', null)
    ),
    { includeUser: true, allowNull: true }
  );

  const { data: peopleTweets, loading: peopleLoading } = useCollection(
    query(
      tweetsCollection,
      where('createdBy', '!=', id),
      where('userRetweets', 'array-contains', id)
    ),
    { includeUser: true, allowNull: true }
  );

  const mergedTweets = mergeData(true, ownerTweets, peopleTweets);

  return (
      <ProtectedLayout>
        <MainLayout>
          <UserLayout>
            <UserDataLayout>
              <UserHomeLayout>
                <section>
                  {ownerLoading || peopleLoading ? (
                      <Loading className='mt-5' />
                  ) : !mergedTweets ? (
                      <StatsEmpty
                          title={`@${username as string} hasn't tweeted`}
                          description='When they do, their Tweets will show up here.'
                      />
                  ) : (
                      <AnimatePresence mode='popLayout'>
                        {pinnedData && (
                            <Tweet pinned {...pinnedData} key={`pinned-${pinnedData.id}`} />
                        )}
                        {mergedTweets.map((tweet) => (
                            <Tweet {...tweet} profile={user} key={tweet.id} />
                        ))}
                      </AnimatePresence>
                  )}
                </section>
              </UserHomeLayout>
            </UserDataLayout>
          </UserLayout>
        </MainLayout>
      </ProtectedLayout>
  );
}

