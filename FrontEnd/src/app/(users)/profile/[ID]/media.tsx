'use client'
import { AnimatePresence } from 'framer-motion';
import { UserLayout, ProtectedLayout } from '../../_components/layout/common-layout';
import { MainLayout } from '../../_components/layout/main-layout';
import { SEO } from '../../_components/common/seo';
import { UserDataLayout } from '../../_components/layout/user-data-layout';
import { UserHomeLayout } from '../../_components/layout/user-home-layout';
import { Content } from '../../_components/content/content';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '../../_components/content/stats-empty';

export default function UserMedia(): JSX.Element {
  /*const { user } = useUser();*/

  /*const { id, name, username } = user ?? {};*/

  /*const { data, loading } = useCollection(
    query(
      tweetsCollection,
      where('createdBy', '==', id),
      where('images', '!=', null)
    ),
    { includeUser: true, allowNull: true }
  );*/

  /*const sortedTweets = mergeData(true, data);*/
    const loading = false;
  return (
              <UserLayout>
                  <UserDataLayout>
                      <UserHomeLayout>
                          <section>
                              <SEO
                                  title={`Media Tweets by ${'name'} (@${
                                      'username'
                                  }) / Twitter`}
                              />
                              {loading ? (
                                  <Loading className='mt-5' />
                              ) /*: !sortedTweets ? (
                                  <StatsEmpty
                                      title={`@${username as string} hasn't Tweeted Media`}
                                      description='Once they do, those Tweets will show up here.'
                                      imageData={{ src: '/assets/no-media.png', alt: 'No media' }}
                                  />
                              ) */: (
                                  <AnimatePresence mode='popLayout'>
                                      {/*{sortedTweets.map((content) => (*/}
                                      <Content  />
                                      {/*))}*/}
                                  </AnimatePresence>
                              )}
                          </section>
                      </UserHomeLayout>
                  </UserDataLayout>
              </UserLayout>
  );
}
