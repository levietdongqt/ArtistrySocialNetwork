import { doc, query, where } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '../../../../context/user-context';
import { mergeData } from '@lib/merge';
import { UserLayout, ProtectedLayout } from '../../_components/layout/common-layout';
import { MainLayout } from '../../_components/layout/main-layout';
import { UserDataLayout } from '../../_components/layout/user-data-layout';
import { UserHomeLayout } from '../../_components/layout/user-home-layout';
import { StatsEmpty } from '../../_components/content/stats-empty';
import { Loading } from '@components/ui/loading';
import { Content } from '../../_components/content/content';


export default function UserTweets() {
  const { user } = useUser();

  const { id, username, pinnedTweet } = user ?? {};

  /*const { data: pinnedData } = useDocument(
    doc(tweetsCollection, pinnedTweet ?? 'null'),
    {
      disabled: !pinnedTweet,
      allowNull: true,
      includeUser: true
    }
  );*/

/*  const { data: ownerTweets, loading: ownerLoading } = useCollection(
    query(
      tweetsCollection,
      where('createdBy', '==', id),
      where('parent', '==', null)
    ),
    { includeUser: true, allowNull: true }
  );*/

 /* const { data: peopleTweets, loading: peopleLoading } = useCollection(
    query(
      tweetsCollection,
      where('createdBy', '!=', id),
      where('userRetweets', 'array-contains', id)
    ),
    { includeUser: true, allowNull: true }
  );*/

  /*const mergedTweets = mergeData(true, ownerTweets, peopleTweets);*/
    const ownerLoading = false;
    const peopleLoading = false;


  return (
          <UserLayout>
            <UserDataLayout>
              <UserHomeLayout>
                <section>
                  {ownerLoading || peopleLoading ? (
                      <Loading className='mt-5' />
                  ) /*: !mergedTweets ? (
                      <StatsEmpty
                          title={`@${username as string} hasn't tweeted`}
                          description='When they do, their Tweets will show up here.'
                      />
                  )*/ : (
                      <AnimatePresence mode='popLayout'>
                       {/* {pinnedData && (*/}
                            {/*<Content pinned {...pinnedData} key={`pinned-${pinnedData.id}`} />*/}
                            <Content key={`pinned-${'1'}`} />
                       {/* )}*/}
                        {/*{mergedTweets.map((content) => (*/}
                            {/*<Content {...content} profile={user} key={content.id} />*/}
                            <Content key={'1'} />
                       {/*))}*/}
                      </AnimatePresence>
                  )}
                </section>
              </UserHomeLayout>
            </UserDataLayout>
          </UserLayout>
  );
}

