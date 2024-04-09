import { Input } from '../input/input';
import { Content } from '../content/content';
import type { TweetProps } from '../content/content';
import {CustomIcon} from "@components/ui/custom-icon";
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import React from "react";

type TweetReplyModalProps = {
  tweet: TweetProps;
  closeModal: () => void;
};

export function ContentReplyModal({
  tweet,
  closeModal
}: TweetReplyModalProps): JSX.Element {
    const repliesData = [
        {
            content: "dddsdfffffffff",
            mediaUrl: [
                "asdasdasdasdasd",
                "asdasdasdasdasda",
            ],
            sendUserId: "7dfaa47d-a0e0-4d0c-9cf2-440bdc02195d",
            sendFullName: "NamVip",
            sendUserAvatarUrl: "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg",
            sendUserCoverImage: "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg",
            sendUserBio: "hahahahhaahahahahah"
        },
        {
            content: "yrdssawriiii",
            mediaUrl: [
                "asdasdasdasdasd",
                "asdasdasdasdasda"
            ],
            sendUserId: "7dfaa47d-a0e0-4d0c-9cf2-440bdc02195d",
            sendFullName: "NamVip",
            sendUserAvatarUrl: "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg",
            sendUserCoverImage: "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg",
            sendUserBio: "hahahahhaahahahahah"
        }
    ];
  return (
        <>
          <div className={'flex bg-gray-500 h-[3.5rem] items-center justify-center relative'}>
              <div className={'items-center'}>
                  <h2>Bài viết của {tweet.user?.fullName}</h2>
              </div>
              <div className={'absolute right-2 top-4'}>
                  <button onClick={closeModal} className={'cursor-pointer hover:before:opacity-[0.1] border-b-sky-400 rounded-full bg-blue-400'}>
                      <CustomIcon iconName={'CloseIcon'} className={''}/>
                  </button>
              </div>
              </div>
            <Input
                modal
                replyModal
                closeModal={closeModal}
                comment
            >
                <Content modal comment={true} parentTweet {...tweet} />
                <div className={`accent-tab hover-card relative flex flex-col  gap-y-4 px-4 py-3 outline-none duration-200`}>
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
                </div>
            </Input>

        </>
  );
}
