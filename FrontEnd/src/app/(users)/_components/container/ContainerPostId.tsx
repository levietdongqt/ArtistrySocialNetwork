'use client'
import React, {useRef, useState} from 'react';
import {Loading} from "@components/ui/loading";
import {Error} from "@components/ui/error";
import {AnimatePresence} from "framer-motion";
import {useParams, usePathname,useRouter} from "next/navigation";
import {isPlural} from "@lib/utils";
import {ViewContent} from "../view/view-content";
import {ViewParentTweet} from "../view/view-parent-tweet";
import {MainHeader} from "../home/main-header";
import {SEO} from "../common/seo";
import useSWR from "swr";
import {getPostById} from "../../../../services/realtime/clientRequest/postClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {getCommentByPost} from "../../../../services/realtime/clientRequest/commentClient";
import {Comment} from "../comment/comment";

const ContainerPostId = () => {
    const {back} = useRouter();
    const {id} = useParams();
    const {data: postData, isLoading:postLoading,mutate:postMutate} = useSWR(getPostById(id as string), fetcherWithToken,{
        refreshInterval: 3000,
    });
    const viewTweetRef = useRef<HTMLElement>(null);

    const {data: repliesData, isLoading: repliesLoading, error,mutate:repliesMutate} = useSWR(postData?.data?.id ? getCommentByPost(postData?.data?.id) : null, fetcherWithToken,{
        refreshInterval:2000,
    });

    const { content, mediaUrl } = postData?.data ?? {};

    const imagesLength = mediaUrl?.length ?? 0;

    const pageTitle = postData
        ? `${postData?.data?.user?.fullName} on Post: "${content ?? ''}${
            mediaUrl ? ` (${imagesLength} image${isPlural(imagesLength)})` : ''
        }" / Post`
        : null;

    return (
        <>
            <MainHeader
                useActionButton
                title={'Bài viết'}
                action={back}
            />
            <section>
                {postLoading ? (
                    <Loading className='mt-5' />
                ) : !postData?.data ? (
                    <>
                        <SEO title='Post not found / Social Media' />
                        <Error message='Post not found' />
                    </>
                ) : (
                    <>
                        {pageTitle && <SEO title={pageTitle} />}
                        <ViewContent viewTweetRef={viewTweetRef} {...postData?.data} comment/>
                        {postData?.data &&
                            (repliesLoading ? (
                                <Loading className='mt-5' />
                            ) : (
                                <AnimatePresence mode='popLayout'>
                                    {repliesData.data?.map((tweet:any) => (
                                        <Comment {...tweet} key={tweet.id} comment />
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