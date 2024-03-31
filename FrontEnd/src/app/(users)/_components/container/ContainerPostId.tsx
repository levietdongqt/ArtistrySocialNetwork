'use client'
import React, {useRef} from 'react';
import {Loading} from "@components/ui/loading";
import {Error} from "@components/ui/error";
import {AnimatePresence} from "framer-motion";
import {useRouter} from "next/router";
import {useDocument} from "@lib/hooks/useDocument";
import {doc, orderBy, query, where} from "firebase/firestore";
import {useCollection} from "@lib/hooks/useCollection";
import {isPlural} from "@lib/utils";
import {ViewContent} from "../view/view-content";
import {ViewParentTweet} from "../view/view-parent-tweet";
import {MainHeader} from "../home/main-header";
import {Content} from "../content/content";

const ContainerPostId = () => {
    const {
        query: { id },
        back
    } = useRouter();

    // const { data: tweetData, loading: tweetLoading } = useDocument(
    //     doc(tweetsCollection, id as string),
    //     { includeUser: true, allowNull: true }
    // );
    //
    // const viewTweetRef = useRef<HTMLElement>(null);
    //
    // const { data: repliesData, loading: repliesLoading } = useCollection(
    //     query(
    //         tweetsCollection,
    //         where('parent.id', '==', id),
    //         orderBy('createdAt', 'desc')
    //     ),
    //     { includeUser: true, allowNull: true }
    // );
    //
    // const { text, images } = tweetData ?? {};

    // const imagesLength = images?.length ?? 0;
    // const parentId = tweetData?.parent?.id;
    //
    // const pageTitle = tweetData
    //     ? `${tweetData.user.name} on Twitter: "${text ?? ''}${
    //         images ? ` (${imagesLength} image${isPlural(imagesLength)})` : ''
    //     }" / Twitter`
    //     : null;

    return (
        <>
            <MainHeader
                useActionButton
                title={parentId ? 'Thread' : 'Tweet'}
                action={back}
            />
            <section>
                {tweetLoading ? (
                    <Loading className='mt-5' />
                ) : !tweetData ? (
                    <>
                        <SEO title='Tweet not found / Twitter' />
                        <Error message='Tweet not found' />
                    </>
                ) : (
                    <>
                        {pageTitle && <SEO title={pageTitle} />}
                        {parentId && (
                            <ViewParentTweet
                                parentId={parentId}
                                viewTweetRef={viewTweetRef}
                            />
                        )}
                        <ViewContent viewTweetRef={viewTweetRef} {...tweetData} />
                        {tweetData &&
                            (repliesLoading ? (
                                <Loading className='mt-5' />
                            ) : (
                                <AnimatePresence mode='popLayout'>
                                    {repliesData?.map((tweet) => (
                                        <Content {...tweet} key={tweet.id} />
                                    ))}
                                </AnimatePresence>
                            ))}
                    </>
                )}
            </section>
            
        </>
    );
};

export default ContainerPostId;