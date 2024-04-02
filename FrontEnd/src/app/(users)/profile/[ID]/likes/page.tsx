'use client'
import { AnimatePresence } from 'framer-motion';
import { UserLayout, ProtectedLayout } from '../../../_components/layout/common-layout';
import { MainLayout } from '../../../_components/layout/main-layout';
import { SEO } from '../../../_components/common/seo';
import { UserDataLayout } from '../../../_components/layout/user-data-layout';
import { UserHomeLayout } from '../../../_components/layout/user-home-layout';
import { Content } from '../../../_components/content/content';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '../../../_components/content/stats-empty';



export default function UserLikes(): JSX.Element {

    /*const {data,loading} = useTweet();*/
    const loading = false;
  return (

              <UserLayout>
                  <UserDataLayout>
                      <UserHomeLayout>
                          <section>
                              <SEO
                                  title={`Tweets liked by ${"ádasdas" as string} (@${
                                      "ádasdasdas" as string
                                  }) / Twitter`}
                              />
                              {loading ? (
                                  <Loading className='mt-5' />
                              ) /*: !data ? (
                                  <StatsEmpty
                                      title={`@${"ádasdasda" as string} hasn't liked any Tweets`}
                                      description='When they do, those Tweets will show up here.'
                                  />
                              )*/ : (
                                  <AnimatePresence mode='popLayout'>
                                      {/*{data.map((content:any) => (*/}
                                          {/*<Content {...content} key={content.id} />*/}
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

