'use client'
import React from 'react';
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {ContentPost} from "../content/content";
import {useUser} from "@nextui-org/user";
import {useParams} from "next/navigation";


class ContainerUser extends React.Component<{  }> {

    render() {
        // const { currentUser } = useUser();
        // const {ID} = useParams();
        const isProvider = false;
        const peopleLoading = false;

        return (
            <section>
                {isProvider ? (
                    <Loading className='mt-5'/>
                ): (
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

