import { AnimatePresence } from 'framer-motion';
import { UserLayout, ProtectedLayout } from '../../_components/layout/common-layout';
import { MainLayout } from '../../_components/layout/main-layout';
import { SEO } from '../../_components/common/seo';
import { UserDataLayout } from '../../_components/layout/user-data-layout';
import { UserHomeLayout } from '../../_components/layout/user-home-layout';
import { Content } from '../../_components/content/content';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '../../_components/content/stats-empty';
import { ContentWithParent } from '../../_components/content/content-with-parent';
import type { ReactElement, ReactNode } from 'react';

export default function UserWithReplies(): JSX.Element {

  const loading = false;


  return (
      <ProtectedLayout>
          <MainLayout>
              <UserLayout>
                  <UserDataLayout>
                      <UserHomeLayout>
                          <section>
                              <SEO
                                  title={`Tweets with replies by ${'name'} (@${
                                      'username'
                                  }) / Twitter`}
                              />
                              {loading ? (
                                  <Loading className='mt-5' />
                              ) /*: !data ? (
                                  <StatsEmpty
                                      title={`@${'username'} hasn't tweeted`}
                                      description='When they do, their Tweets will show up here.'
                                  />
                              )*/ : (
                                  <AnimatePresence mode='popLayout'>
                                      {/*{pinnedData && (*/}
                                          <Content pinned key={`pinned-${'1'}`} />
                                      {/*)}*/}
                                      {/*<ContentWithParent data={data} />*/}
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
