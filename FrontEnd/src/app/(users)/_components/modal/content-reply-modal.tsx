import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Loading } from "@components/ui/loading";
import { AnimatePresence } from "framer-motion";
import { Input } from '../input/input';
import { Content } from '../content/content';
import { CustomIcon } from "@components/ui/custom-icon";
import { Comment } from "../comment/comment";
import type { TweetProps } from '../content/content';
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import {getPostById} from "../../../../services/realtime/clientRequest/postClient";
import {getCommentByPost} from "../../../../services/realtime/clientRequest/commentClient";

type TweetReplyModalProps = {
    post: TweetProps;
    closeModal: () => void;
};

export function ContentReplyModal({
                                      post,
                                      closeModal
                                  }: TweetReplyModalProps): JSX.Element {
    const [hasFetched, setHasFetched] = useState(false);

    // Fetch post data if needed
    const { data: postData } = useSWR(
        hasFetched ? null : getPostById(post?.id), fetcherWithToken, {
            onSuccess: () => setHasFetched(true),
        }
    );

    // Fetch comments, ensure that we don't re-fetch if hasFetched is true
    const { data: repliesData, isLoading: repliesLoading } = useSWR(
       getCommentByPost(post?.id), fetcherWithToken, {
            refreshInterval: 2000
        }
    );

    useEffect(() => {
        // Effect to run when component mounts, trigger fetch once
        setHasFetched(false);
    }, [post.id]); // Only re-run the effect if post.id changes

    return (
        <div className="relative">
            <div className="sticky top-0 z-20 bg-gray-500 h-[3.5rem] flex items-center justify-center">
                <div className="items-center">
                    <h2>Bài viết của {post.user?.fullName}</h2>
                </div>
                <div className="absolute right-2 top-4">
                    <button onClick={closeModal} className="cursor-pointer hover:before:opacity-[0.1] border-b-sky-400 rounded-full bg-blue-400">
                        <CustomIcon iconName={'CloseIcon'} />
                    </button>
                </div>
            </div>
            <Input
                postID={post?.id}
                modal
                replyModal
                closeModal={closeModal}
                comment
            >
                {
                    !hasFetched ? (
                        <Loading className='mt-5' />
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            <Content modal comment={true} {...post} {...postData} />
                        </AnimatePresence>
                    )
                }
                <div className={`accent-tab hover-card relative flex flex-col gap-y-4 px-4 py-3 outline-none duration-200`}>
                    {
                        repliesLoading ?(
                            <Loading className='mt-5' />
                        ) : (
                            <AnimatePresence mode='popLayout'>
                                {repliesData?.data?.map((commentData:any) => (
                                    <Comment parentTweet comment replyTags {...commentData} key={commentData.id} />
                                ))}
                            </AnimatePresence>
                        )
                    }
                </div>
            </Input>
        </div>
    );
}