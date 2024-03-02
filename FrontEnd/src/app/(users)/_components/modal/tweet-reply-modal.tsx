import { Input } from '../input/input';
import { Content } from '../content/content';
import type { TweetProps } from '../content/content';

type TweetReplyModalProps = {
  tweet: TweetProps;
  closeModal: () => void;
};

export function TweetReplyModal({
  tweet,
  closeModal
}: TweetReplyModalProps): JSX.Element {
  return (
    <Input
      modal
      replyModal
      parent={{ id: "content.id", username: "content.user.username" }}
      closeModal={closeModal}
    >
      <Content modal parentTweet/>
    </Input>
  );
}
