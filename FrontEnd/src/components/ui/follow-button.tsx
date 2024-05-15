import { useModal } from "@lib/hooks/useModal";
import {preventBubbling, sleep} from "@lib/utils";
import { Modal } from "../../app/(users)/_components/modal/modal";
import { ActionModal } from "../../app/(users)/_components/modal/action-modal";
import { Button } from "@components/ui/button";
import {
  acceptFriend,
  addFriend,
  followingFriend,
  isFollowing,
  removeFriend,
  returnAddFriend,
  unAcceptFriend,
  unFollowingFriend,
} from "services/main/clientRequest/friendsClient";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import useSWR, { mutate } from "swr";
import { FollowButtonType } from "@models/notifications";
import { Typography } from "antd";
import { toast } from "react-toastify";
import { getUserSearch } from "services/main/clientRequest/searchClient";
import {useRecoilValue} from "recoil";
import {mutateFriend} from "@lib/hooks/mutateFriend";

const { Text } = Typography;

type FollowButtonProps = {
  userTargetId: string;
  userTargetUsername: string;
  hovered:boolean;
};

export function FollowButton({
  userTargetId,
  userTargetUsername,
  hovered,
}: FollowButtonProps): JSX.Element | null {
  const { currentUser } = useUser();
  const {
    open: openUnFollow,
    openModal: openUnFollowModal,
    closeModal: closeUnFollowModal,
  } = useModal();
  const {
    open: openUnfriend,
    openModal: openUnFriendModal,
    closeModal: closeUnFriendModal,
  } = useModal();
  const {
    open: openReAccept,
    openModal: openReAcceptModal,
    closeModal: closeReAcceptModal,
  } = useModal();
  const [shouldUnFollowed, setShouldUnFollowed] = useState(false);
  const [shouldFollowed, setShouldFollowed] = useState(false);
  const [shouldAddFriend, setShouldAddFriend] = useState(false);
  const [shouldUnFriend, setShouldUnFriend] = useState(false);
  const [shouldReFriend, setShouldReFriend] = useState(false);
  const [shouldAcceptFriend, setShouldAcceptFriend] = useState(false);
  const [renderFollow,setRenderFollow] = useState(false);
  const [renderFriend,setRenderFriend] = useState(false);
  const [renderPending,setRenderPending] = useState(false);
  const [renderAccept,setRenderAccept] = useState(false);
  //Xử lý follow
  const { data: data } = useSWR(
    hovered
      ? isFollowing({
          userId: currentUser?.id as string,
          friendId: userTargetId,
        })
      : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
    }
  );
  useEffect(()=>{
    if(data){
      setRenderFollow(data.data.follow)
      setRenderPending(data.data.pending)
      setRenderAccept(data.data.acceptFriend)
      setRenderFriend(data.data.friend)
    }
  },[data])


  const {isLoading:unFollowLoadingFriend} = useSWR(
    shouldUnFollowed?
    unFollowingFriend({
        userId: currentUser?.id as string,
        friendId: userTargetId
      }):null,
  fetcherWithToken,{
    revalidateOnFocus: false,
          onSuccess(data, key, config) {
              toast.success("Bỏ theo dõi thành công");
              setRenderFollow(false);
          },
  }
);


const {isLoading:FollowLoadingFriend} = useSWR(
  shouldFollowed?
  followingFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
        onSuccess(data, key, config) {
            toast.success("Theo dõi thành công");
            setRenderFollow(true);
        },
}
);

  useEffect(() => {
    if (shouldUnFollowed) {
      setShouldUnFollowed(false);
    }
  }, [shouldUnFollowed]);

  useEffect(() => {
    if (shouldFollowed) {
      setShouldFollowed(false);
    }
  }, [shouldFollowed]);

const handleUnfollow = async () =>{
  setShouldUnFollowed(true);
    if(unFollowLoadingFriend == false){
        await sleep(2000);
        if(mutateFriends){
            await mutateFriends();
        }
    }
  closeUnFollowModal();
}

const handlefollow = async () =>{
  setShouldFollowed(true);
    if(FollowLoadingFriend == false){
        await sleep(2000);
        if(mutateFriends){
            await mutateFriends();
        }
    }
}

//Xử lý kết bạn
const {isLoading} = useSWR(
  shouldAddFriend?
  addFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
        onSuccess(data, key, config) {
            toast.success("Thêm bạn bè thành công");
            setRenderPending(true)
        },
}
);
const {isLoading:removeLoadingFriend} = useSWR(
  shouldUnFriend?
  removeFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
        onSuccess(data, key, config) {
            toast.success("Xóa bạn bè thành công");
            setRenderFriend(false);
            setRenderFollow(false);
        },
}
);

  const {} = useSWR(
    shouldReFriend
      ? returnAddFriend({
          userId: currentUser?.id as string,
          friendId: userTargetId,
        })
      : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        toast.success("Rút lại lời mời kết bạn thành công");
        setRenderPending(!renderPending)
    },
    }
  );

  const {} = useSWR(
    shouldAcceptFriend
      ? acceptFriend({
          userId: currentUser?.id as string,
          friendId: userTargetId,
        })
      : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        toast.success("Chấp nhận lời mời kết bạn thành công");
        setRenderFriend(true);
        setRenderFollow(true);
    },
    }
  );

    const mutateFriends = useRecoilValue(mutateFriend);
  const handleAddFriend = async () =>{
    setShouldAddFriend(true);
  };

  const handleRemoveFriend = async () =>{
    setShouldUnFriend(true);
    if(removeLoadingFriend == false){
        await sleep(2000);
        if(mutateFriends){
            await mutateFriends();
        }
    }
    closeUnFriendModal();
  };

  const handleReAcceptFriend = () => {
    setShouldReFriend(true);
    closeReAcceptModal();
  };

  const handleAcceptFriend = () => {
    setShouldAcceptFriend(true);
  };

  useEffect(() => {
    if (shouldAddFriend) {
      setShouldAddFriend(false);
    }
  }, [shouldAddFriend]);

  useEffect(() => {
    if (shouldUnFriend) {
      setShouldUnFriend(false);
    }
  }, [shouldUnFriend]);

  useEffect(() => {
    if (shouldReFriend) {
      setShouldReFriend(false);
    }
  }, [shouldReFriend]);

  useEffect(() => {
    if (shouldAcceptFriend) {
      setShouldAcceptFriend(false);
    }
  }, [shouldAcceptFriend]);

  return (
    <>
      <Modal
        modalClassName="flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={openUnFollow}
        closeModal={closeUnFollowModal}
      >
        <ActionModal
          title={`Bỏ theo dõi @${userTargetUsername}?`}
          description="Bạn có chắc là muốn bỏ theo dõi người này chứ?"
          mainBtnLabel="Đồng ý"
          action={() => handleUnfollow()}
          closeModal={closeUnFollowModal}
          actionReport={() => {}}
        />
      </Modal>
      <Modal
        modalClassName="flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={openUnfriend}
        closeModal={closeUnFriendModal}
      >
        <ActionModal
          title={`Huỷ kết bạn @${userTargetUsername}?`}
          description="Bạn có chắc là muốn hủy kết bạn với người này chứ?"
          mainBtnLabel="Đồng ý"
          action={() => handleRemoveFriend()}
          closeModal={closeUnFriendModal}
          actionReport={() => {}}
        />
      </Modal>
      <Modal
        modalClassName="flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={openReAccept}
        closeModal={closeReAcceptModal}
      >
        <ActionModal
          title={`Rút lại lời mời với @${userTargetUsername}?`}
          description="Bạn có chắc là muốn rút lại lời mời với người này chứ?"
          mainBtnLabel="Đồng ý"
          action={() => handleReAcceptFriend()}
          closeModal={closeReAcceptModal}
          actionReport={() => {}}
        />
      </Modal>
      <div className="flex flex-col">
        {renderFollow ? (
          <Button
            className='dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Bỏ_theo_dõi"] inner:hover:hidden dark:border-light-secondary'
            onClick={preventBubbling(openUnFollowModal)}
          >
            <span>{FollowButtonType.FOLLOWING_BUTTON}</span>
          </Button>
        ) : (
          <Button
            className="self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75 min-w-[120px]"
            onClick={preventBubbling(() => {
              handlefollow();
            })}
          >
            {FollowButtonType.FOLLOW_BUTTON}
          </Button>
        )}
        {renderFriend ? (
          <Button
            className='dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Hủy_kết_bạn"] inner:hover:hidden dark:border-light-secondary'
            onClick={preventBubbling(openUnFriendModal)}
          >
            <span>{FollowButtonType.FRIENDED_BUTTON}</span>
          </Button>
        ) : renderPending ? (
          <Button
            className='dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5
                   font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                   hover:before:content-["Rút_lại_lời_mời"] inner:hover:hidden dark:border-light-secondary'
            onClick={preventBubbling(openReAcceptModal)}
          >
            <span>{FollowButtonType.PENDING_BUTTON}</span>
          </Button>
        ) : renderAccept ? (
          <Button
            className="self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75 min-w-[120px]"
            onClick={preventBubbling(() => {
              handleAcceptFriend();
            })}
          >
            {FollowButtonType.ACCEPT_FRIEND_BUTTON}
          </Button>
        ) : (
          <Button
            className="self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75 min-w-[120px]"
            onClick={preventBubbling(() => {
              handleAddFriend();
            })}
          >
            {FollowButtonType.ADD_FRIEND_BUTTON}
          </Button>
        )}
      </div>
    </>
  );
}
