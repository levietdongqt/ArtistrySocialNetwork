'use client'
import { Loading } from '@components/ui/loading';
import { Content } from 'antd/es/layout/layout';
import { SEO } from 'app/(users)/_components/common/seo';
import { UserLayout } from 'app/(users)/_components/layout/common-layout';
import { UserDataLayout } from 'app/(users)/_components/layout/user-data-layout';
import { UserHomeLayout } from 'app/(users)/_components/layout/user-home-layout';
import { AnimatePresence } from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';

export default function UserWithReplies(): JSX.Element {

  const loading = false;


  return (
            //   <UserLayout>
            //       <UserDataLayout>
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
                                          <Content  key={`pinned-${'1'}`} />
                                      {/*)}*/}
                                      {/*<ContentWithParent data={data} />*/}
                                  </AnimatePresence>
                              )}
                          </section>
                      </UserHomeLayout>
            //       </UserDataLayout>
            //   </UserLayout>
  );
}
