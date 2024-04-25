'use client'
import { AnimatePresence } from 'framer-motion';
import {UserDataLayout} from "../../../../_components/layout/user-data-layout";
import {UserLayout} from "../../../../_components/layout/common-layout";
import {UserHomeLayout} from "../../../../_components/layout/user-home-layout";
import {SEO} from "../../../../_components/common/seo";
import {Loading} from "@components/ui/loading";
import {ServiceMini} from "../../../../services/[id]/service-mini";


export default function UserMedia(): JSX.Element {

    const loading = false;
  return (

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
                              ) */
                                  : (
                                  <AnimatePresence mode='popLayout'>
                                      {/*{sortedTweets.map((content) => (*/}
                                      <ServiceMini  />
                                      {/*))}*/}
                                  </AnimatePresence>
                              )}
                          </section>

  );
}
