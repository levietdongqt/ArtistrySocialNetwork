import { Input } from '../input/input';
import { Content } from '../content/content';
import type { TweetProps } from '../content/content';
import {CustomIcon} from "@components/ui/custom-icon";
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import React from "react";
import useSWR from "swr";
import {getCommentbyPost} from "../../../../services/realtime/clientRequest/commentClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import { Comments } from '@models/comment';
import { User } from '@models/user';
import {Comment} from "../comment/comment";

type TweetReplyModalProps = {
    tweet: TweetProps;
    closeModal: () => void;
};

export function ContentReplyModal({
                                      tweet,
                                      closeModal
                                  }: TweetReplyModalProps): JSX.Element {
    const {data: repliesData, isLoading: repliesLoading, error} = useSWR(getCommentbyPost(tweet?.id), fetcherWithToken);
    return (
        <div className="relative " >
            <div className="sticky top-0 z-10 bg-gray-500 h-[3.5rem] flex items-center justify-center">
                <div className="items-center">
                    <h2>Bài viết của {tweet.user?.fullName}</h2>
                </div>
                <div className="absolute right-2 top-4">
                    <button onClick={closeModal} className="cursor-pointer hover:before:opacity-[0.1] border-b-sky-400 rounded-full bg-blue-400">
                        <CustomIcon iconName={'CloseIcon'} />
                    </button>
                </div>
            </div>
            <Input
                postID={tweet?.id}
                modal
                replyModal
                closeModal={closeModal}
                comment
            >
                <Content modal comment={true} parentTweet {...tweet} />
                <div
                    className={`accent-tab hover-card relative flex flex-col gap-y-4 px-4 py-3 outline-none duration-200`}>
                    {
                        repliesLoading ? (
                            <Loading className='mt-5'/>
                        ) : (
                            <AnimatePresence mode='popLayout'>
                                {repliesData.data?.map((tweet:any) => (
                                    <Comment {...tweet} key={tweet.id} />
                                ))}
                            </AnimatePresence>
                        )}
                </div>
            </Input>
        </div>
  );
}
