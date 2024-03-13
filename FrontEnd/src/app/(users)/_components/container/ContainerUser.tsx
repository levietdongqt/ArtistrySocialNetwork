'use client'
import React from 'react';
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {Content} from "../content/content";

const ContainerUser = () => {
    /*const { user } = useUser();*/

    /*const { id, username, pinnedTweet } = user ?? {};*/

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
                    <Content  />
                    {/*))}*/}
                </AnimatePresence>
            )}
        </section>
    );
};

export default ContainerUser;

