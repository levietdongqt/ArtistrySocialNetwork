'use client'
import React, {useEffect, useMemo} from 'react';
import {Button} from "@components/ui/button";
import {HeroIcon} from "@components/ui/hero-icon";
import {ToolTip} from "@components/ui/tooltip";
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {useModal} from "@lib/hooks/useModal";
import useSWR from "swr";
import {useUser} from "../../../../../../context/user-context";
import {getBookmarksByUserId} from "../../../../../../services/realtime/clientRequest/bookmarksClient";
import {
    getPostListByPostId,
    getPostsByUserId,
    getPostsLimit
} from "../../../../../../services/realtime/clientRequest/postClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {ContentPost} from "../../../../_components/content/content";
import {useInfiniteScroll} from "@lib/hooks/useInfiniteScroll";
import {useParams} from "next/navigation";
import {useRecoilState} from "recoil";
import {mutateProfilePost} from "@lib/hooks/mutateProfilePost";


const PostUser = () => {
    const { currentUser } = useUser();
    const { ID } = useParams()
    const { open, openModal, closeModal } = useModal();
    const [,setMutateProfile] = useRecoilState(mutateProfilePost);
    const userId = ID;
    // const { data: bookmarksRef, isLoading: bookmarksRefLoading } = useSWR(getBookmarksByUserId(userId),fetcherWithToken,{
    //     revalidateIfStale: false,
    //     revalidateOnFocus: false,
    //     revalidateOnReconnect: false
    // });
    ///

    const { paginatedPosts:postData, isLoadingMore:postLoading,LoadMore,isReachedEnd,setSize,size,mutate,error } =
        useInfiniteScroll(
            getPostsByUserId
        );
    useEffect(() => {
        setMutateProfile(() => mutate);
    }, [mutate,setMutateProfile]);
    return (
        <>
            <section className='mt-0.5'>
                { postLoading ? (
                    <Loading className='mt-5' />
                ) :(
                    <AnimatePresence mode='popLayout'>
                        {postData?.map((post:any) => (
                            <ContentPost {...post} key={post.id} />
                        ))}

                    </AnimatePresence>
                )}
            </section>
        </>
    );
};

export default PostUser;