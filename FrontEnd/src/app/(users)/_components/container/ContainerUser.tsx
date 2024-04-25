'use client'
import React from 'react';
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";


class ContainerUser extends React.Component<{  }> {
    render() {


        const ownerLoading = false;
        const peopleLoading = false;

        return (
            <section>
                {ownerLoading || peopleLoading ? (
                    <Loading className='mt-5'/>
                ) /*: !mergedTweets ? (
                      <StatsEmpty
                          title={`@${username as string} hasn't tweeted`}
                          description='When they do, their Tweets will show up here.'
                      />
                  )*/ : (
                    <AnimatePresence mode='popLayout'>
                        {/* {pinnedData && (*/}
                        {/*<Content pinned {...pinnedData} key={`pinned-${pinnedData.id}`} />*/}
                        {/* )}*/}
                        {/*{mergedTweets.map((content) => (*/}
                        {/*<Content {...content} profile={user} key={content.id} />*/}
                        {/*))}*/}

                    </AnimatePresence>
                )}
            </section>
        );
    }
}

export default ContainerUser;

