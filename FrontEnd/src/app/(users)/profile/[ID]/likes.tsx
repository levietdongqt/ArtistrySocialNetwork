import { AnimatePresence } from 'framer-motion';
import { UserLayout, ProtectedLayout } from '../../_components/layout/common-layout';
import { MainLayout } from '../../_components/layout/main-layout';
import { SEO } from '../../_components/common/seo';
import { UserDataLayout } from '../../_components/layout/user-data-layout';
import { UserHomeLayout } from '../../_components/layout/user-home-layout';
import { Tweet } from '../../_components/tweet/tweet';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '../../_components/tweet/stats-empty';



export default function UserLikes(): JSX.Element {

    /*const {data,loading} = useTweet();*/
    const loading = false;
  return (
      <ProtectedLayout>
          <MainLayout>
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
                                      {/*{data.map((tweet:any) => (*/}
                                          {/*<Tweet {...tweet} key={tweet.id} />*/}
                                          <Tweet  key={'1'} />
                                      {/*))}*/}
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

