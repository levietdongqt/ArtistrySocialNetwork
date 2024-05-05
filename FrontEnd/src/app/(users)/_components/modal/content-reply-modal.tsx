import React, {useState, useEffect, useRef, useReducer} from "react";
import useSWR, {mutate} from "swr";
import { Loading } from "@components/ui/loading";
import { AnimatePresence } from "framer-motion";
import { Input } from '../input/input';
import { ContentPost } from '../content/content';
import { CustomIcon } from "@components/ui/custom-icon";
import { Comment } from "../comment/comment";
import type { TweetProps } from '../content/content';
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import {getPostById} from "../../../../services/realtime/clientRequest/postClient";
import {getCommentByPost} from "../../../../services/realtime/clientRequest/commentClient";
import {useSocket} from "../../../../context/websocket-context1";
import SockJS from "sockjs-client";
import {Client, over} from "webstomp-client";
import {Stomp} from "@stomp/stompjs";
import commentsReducer from "../comment/commentReducer";


type TweetReplyModalProps = {
    post: TweetProps;
    closeModal: () => void;
};

export function ContentReplyModal({
                                      post,
                                      closeModal
                                  }: TweetReplyModalProps): JSX.Element {
    const {stompClient} = useSocket();
    const [state, dispatch] = useReducer(commentsReducer, { comments: [] });
    useEffect(() => {
       var subscription = stompClient?.subscribe('/topic/comments/' + post.id, function (comment) {
           dispatch({ type: 'ADD_REPLIES', payload: JSON.parse(comment.body) });
        });
    return () => {
        if (subscription) {
            subscription.unsubscribe();
        }
        };
    }, [post.id,stompClient]);

    const { data: postData,isLoading:loadingPost } = useSWR(
        getPostById(post?.id), fetcherWithToken
    );
    // Fetch comments, ensure that we don't re-fetch if hasFetched is true
    const { data: commentsData, isLoading: repliesLoading,mutate } = useSWR(
        getCommentByPost(post?.id), fetcherWithToken
    );
    useEffect(() => {
        if (commentsData && commentsData.data) {
            dispatch({ type: 'SET_INITIAL_COMMENTS', payload: commentsData.data });
        }
    }, [commentsData]);

    const handleCloseModal = () => {
        closeModal();
    };
    return (
        <div className="relative">
            <div className="sticky top-0 z-20 bg-gray-500 h-[3.5rem] flex items-center justify-center">
                <div className="items-center">
                    <h2>Bài viết của {post.user?.fullName}</h2>
                </div>
                <div className="absolute right-2 top-4">
                    <button onClick={handleCloseModal} className="cursor-pointer hover:before:opacity-[0.1] border-b-sky-400 rounded-full bg-blue-400">
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
                    loadingPost ? (
                        <Loading className='mt-5' />
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            <ContentPost modal comment={true} {...post} {...postData} />
                        </AnimatePresence>
                    )
                }
                <div className={`accent-tab hover-card relative flex flex-col gap-y-4 px-4 py-3 outline-none duration-200`}>
                    {
                        repliesLoading ? (
                            <Loading className='mt-5' />
                        ) : (
                            <AnimatePresence mode='popLayout'>
                                {state.comments?.map((commentData:any) => (
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