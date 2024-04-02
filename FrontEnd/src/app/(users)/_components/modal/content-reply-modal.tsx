import { Input } from '../input/input';
import { Content } from '../content/content';
import type { TweetProps } from '../content/content';
import {CustomIcon} from "@components/ui/custom-icon";

type TweetReplyModalProps = {
  tweet: TweetProps;
  closeModal: () => void;
};

export function ContentReplyModal({
                                    tweet,
                                    closeModal
                                  }: TweetReplyModalProps): JSX.Element {
  return (
      <>
        <div className={'flex bg-gray-500 h-[3.5rem] items-center justify-center relative'}>
          <div className={'items-center'}>
            <h2>Bài viết của {tweet.user?.username}</h2>
          </div>
          <div className={'absolute right-2 top-4'}>
            <button onClick={closeModal} className={'cursor-pointer'}>
              <CustomIcon iconName={'CloseIcon'}/>
            </button>
          </div>
        </div>
        <Input
            modal
            replyModal
            closeModal={closeModal}
        >
          <Content modal parentTweet {...tweet} />
        </Input>
      </>
  );
}
