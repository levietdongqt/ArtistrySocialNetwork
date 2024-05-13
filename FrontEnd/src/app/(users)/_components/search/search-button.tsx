
import { useModal } from '@lib/hooks/useModal';
import { preventBubbling } from '@lib/utils';
import { Modal } from '../modal/modal';
import { ActionModal } from '../modal/action-modal';
import { Button } from '@components/ui/button';
import { acceptFriend, addFriend, followingFriend, removeFriend, returnAddFriend, unAcceptFriend, unFollowingFriend } from 'services/main/clientRequest/friendsClient';
import { useUser } from 'context/user-context';
import { useEffect, useState } from 'react';
import { fetcherWithToken } from '@lib/config/SwrFetcherConfig';
import useSWR from 'swr';
import { FollowButtonType } from '@models/notifications';
import {Typography} from "antd";
import { toast } from 'react-toastify';

const { Text } = Typography;

type SearchButtonProps = {
  userTargetId: string;
  userTargetUsername: string;
  follow: Boolean;
  pending: Boolean;
  friend: Boolean;
  acceptedFriend: Boolean;
};

export function SearchButton({
  userTargetId,
  userTargetUsername,
  follow,
  pending,
  friend,
  acceptedFriend,
  
}: SearchButtonProps): JSX.Element | null {
  const {currentUser} = useUser();
  const { open:openUnFollow, openModal:openUnFollowModal, closeModal:closeUnFollowModal } = useModal();
  const { open:openUnfriend, openModal:openUnFriendModal, closeModal:closeUnFriendModal } = useModal();
  const { open:openReAccept, openModal:openReAcceptModal, closeModal:closeReAcceptModal } = useModal();
  const [shouldUnFollowed,setShouldUnFollowed] = useState(false);
  const [shouldFollowed,setShouldFollowed] = useState(false);
  const [shouldAddFriend,setShouldAddFriend] = useState(false);
  const [shouldUnFriend,setShouldUnFriend] = useState(false);
  const [shouldReFriend,setShouldReFriend] = useState(false);
  const [shouldAcceptFriend,setShouldAcceptFriend] = useState(false);
  const [renderFollow,setRenderFollow] = useState(follow);
  const [renderFriend,setRenderFriend] = useState(friend);
  const [renderPending,setRenderPending] = useState(pending);
  const [renderAccept,setRenderAccept] = useState(acceptedFriend);
  //Xử lý follow
  const {} = useSWR(
    shouldUnFollowed?
    unFollowingFriend({
        userId: currentUser?.id as string,
        friendId: userTargetId
      }):null,
  fetcherWithToken,{
    revalidateOnFocus: false,
    onSuccess(data, key, config) {
        toast.success("Hủy theo dõi thành công");
        setRenderFollow(!renderFollow);
    },
  }
);


const {} = useSWR(
  shouldFollowed?
  followingFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
  onSuccess(data, key, config) {
    toast.success("Theo dõi thành công");
    setRenderFollow(!renderFollow);
},
}
);

useEffect(()=>{
  if(shouldUnFollowed){
    setShouldUnFollowed(false);
  }
},[shouldUnFollowed])

useEffect(()=>{
  if(shouldFollowed){
    setShouldFollowed(false);
  }
},[shouldFollowed])

const handleUnfollow = () =>{
  setShouldUnFollowed(true);
  //setRenderFollow(!renderFollow);
  closeUnFollowModal();
}

const handlefollow = () =>{
  setShouldFollowed(true);
  //setRenderFollow(!renderFollow);
}

//Xử lý kết bạn
const {} = useSWR(
  shouldAddFriend?
  addFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
  onSuccess(data, key, config) {
    toast.success("Kết bạn thành công");
    setRenderPending(!renderPending);
},
}
);
const {} = useSWR(
  shouldUnFriend?
  removeFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
  onSuccess(data, key, config) {
    toast.success("Hủy kết bạn thành công");
    setRenderFriend(!renderFriend);
},
}
);

const {} = useSWR(
  shouldReFriend?
  returnAddFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
  onSuccess(data, key, config) {
    toast.success("Rút lời mời kết bạn thành công");
    setRenderPending(!renderPending);
},
}
);

const {} = useSWR(
  shouldAcceptFriend ?
  acceptFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
  onSuccess(data, key, config) {
    toast.success("Chấp nhận lời mời kết bạn thành công");
    setRenderFriend(!renderFriend);
},
}
);

  const handleAddFriend = () =>{
    setShouldAddFriend(true);
    //setRenderPending(!renderPending);
  }

  const handleRemoveFriend = () =>{
    setShouldUnFriend(true);
    //setRenderFriend(!renderFriend);
    closeUnFriendModal();
  }

  const handleReAcceptFriend = () =>{
    setShouldReFriend(true);
    //setRenderPending(!renderPending);
    closeReAcceptModal();
  }

  const handleAcceptFriend = () =>{
    setShouldAcceptFriend(true);
    setRenderFriend(!renderFriend);
  }



  useEffect(()=>{
    if(shouldAddFriend){
      setShouldAddFriend(false);
    }
  },[shouldAddFriend])

  useEffect(()=>{
    if(shouldUnFriend){
      setShouldUnFriend(false);
    }
  },[shouldUnFriend])

  useEffect(()=>{
    if(shouldReFriend){
      setShouldReFriend(false);
    }
  },[shouldReFriend])

  useEffect(()=>{
    if(shouldAcceptFriend){
      setShouldAcceptFriend(false);
    }
  },[shouldAcceptFriend])



  return (
    <>
      <Modal
        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={openUnFollow}
        closeModal={closeUnFollowModal}
      >
        <ActionModal
          title={`Bỏ theo dõi @${userTargetUsername}?`}
          description='Bạn có chắc là muốn bỏ theo dõi người này chứ?'
          mainBtnLabel='Đồng ý'
          action={()=> handleUnfollow()}
          closeModal={closeUnFollowModal}
          actionReport={()=>{}}
        />
      </Modal>
      <Modal

        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={openUnfriend}
        closeModal={closeUnFriendModal}
      >
        <ActionModal
          title={`Huỷ kết bạn @${userTargetUsername}?`}
          description='Bạn có chắc là muốn hủy kết bạn với người này chứ?'
          mainBtnLabel='Đồng ý'
          action={()=> handleRemoveFriend()}
          closeModal={closeUnFriendModal}
          actionReport={()=>{}}
        />
      </Modal>
      <Modal

        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={openReAccept}
        closeModal={closeReAcceptModal}
      >
        <ActionModal
          title={`Rút lại lời mời với @${userTargetUsername}?`}
          description='Bạn có chắc là muốn rút lại lời mời với người này chứ?'
          mainBtnLabel='Đồng ý'
          action={()=> handleReAcceptFriend()}
          closeModal={closeReAcceptModal}
          actionReport={()=>{}}
        />
      </Modal>
      <div className='flex flex-col'>
      {renderFollow ? (
        <Button
          className='dark-bg-tab min-w-[130px] self-start border border-light-line-reply px-4 py-1.5 
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Bỏ_theo_dõi"] inner:hover:hidden dark:border-light-secondary'
          onClick={preventBubbling(openUnFollowModal)}
        >
          <span>{FollowButtonType.FOLLOWING_BUTTON}</span>
        </Button>
      ) : (
        <Button
          className='self-start border min-w-[130px] bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75 min-w-[120px]'
          onClick={preventBubbling(()=>{
            handlefollow();
          })}
        >
          {FollowButtonType.FOLLOW_BUTTON}
        </Button>
      )
      }
      {renderFriend ? (
        <Button
          className='dark-bg-tab min-w-[130px] self-start border border-light-line-reply px-4 py-1.5 
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Hủy_kết_bạn"] inner:hover:hidden dark:border-light-secondary'
          onClick={preventBubbling(openUnFriendModal)}
        >
          <span>{FollowButtonType.FRIENDED_BUTTON}</span>
        </Button>
      ) : 
      renderPending ? (
        <Button
        className='dark-bg-tab min-w-[130px] self-start border border-light-line-reply px-4 py-1.5 
                   font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                   hover:before:content-["Rút_lại_lời_mời"] inner:hover:hidden dark:border-light-secondary'
        onClick={preventBubbling(openReAcceptModal)}
      >
        <span>{FollowButtonType.PENDING_BUTTON}</span>
      </Button>
      )
      :
      renderAccept ?(
        <Button
          className='self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75 min-w-[120px]'
          onClick={preventBubbling(()=>{
            handleAcceptFriend();
          })}
        >
          {FollowButtonType.ACCEPT_FRIEND_BUTTON}
        </Button>
      )
      :
      (
        <Button
          className='self-start border min-w-[130px] bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75 min-w-[120px]'
          onClick={preventBubbling(()=>{
            handleAddFriend();
          })}
        >
          {FollowButtonType.ADD_FRIEND_BUTTON}
        </Button>
      )
      }
        </div>
    </>
  );
}
