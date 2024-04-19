
import { useModal } from '@lib/hooks/useModal';
import { preventBubbling } from '@lib/utils';
import { Modal } from '../../app/(users)/_components/modal/modal';
import { ActionModal } from '../../app/(users)/_components/modal/action-modal';
import { Button } from '@components/ui/button';
import { acceptFriend, addFriend, followingFriend, isFollowing, removeFriend, unAcceptFriend, unFollowingFriend } from 'services/main/clientRequest/friendsClient';
import { useUser } from 'context/user-context';
import { useEffect, useState } from 'react';
import { fetcherWithToken } from '@lib/config/SwrFetcherConfig';
import useSWR from 'swr';
import { FollowButtonType } from '@models/notifications';
import {Typography} from "antd";

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
  const {currentUser} = useUser();
  const { open:open1, openModal:openModal1, closeModal:closeModal1 } = useModal();
  const { open:open2, openModal:openModal2, closeModal:closeModal2 } = useModal();
  const [shouldUnFollowed,setShouldUnFollowed] = useState(false);
  const [shouldFollowed,setShouldFollowed] = useState(false);
  const [shouldAddFriend,setShouldAddFriend] = useState(false);
  const [shouldUnFriend,setShouldUnFriend] = useState(false);
  const { data: data } = useSWR(
    hovered?
      isFollowing({
          userId: currentUser?.id as string,
          friendId: userTargetId
        }):null,
    fetcherWithToken,{
      revalidateOnFocus: false,
    }
  );
  const {} = useSWR(
    shouldUnFollowed?
    unFollowingFriend({
        userId: currentUser?.id as string,
        friendId: userTargetId
      }):null,
  fetcherWithToken,{
    revalidateOnFocus: false,
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
}
);

const {} = useSWR(
  shouldAddFriend?
  addFriend({
      userId: currentUser?.id as string,
      friendId: userTargetId
    }):null,
fetcherWithToken,{
  revalidateOnFocus: false,
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
}
);



  const handleUnfollow = () =>{
    setShouldUnFollowed(true);
    closeModal1();
  }

  const handlefollow = () =>{
    setShouldFollowed(true);
  }

  const handleAccept = () =>{
    setShouldAddFriend(true);
  }

  const handleUnAccept = () =>{
    setShouldUnFriend(true);
    closeModal2();
  }

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


  return (
    <>
      <Modal
        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={open1}
        closeModal={closeModal1}
      >
        <ActionModal
          title={`Bỏ theo dõi @${userTargetUsername}?`}
          description='Bạn có chắc là muốn bỏ theo dõi người này chứ?'
          mainBtnLabel='Đồng ý'
          action={()=> handleUnfollow()}
          closeModal={closeModal1}
        />
      </Modal>
      <Modal

        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={open2}
        closeModal={closeModal2}
      >
        <ActionModal
          title={`Huỷ kết bạn @${userTargetUsername}?`}
          description='Bạn có chắc là muốn hủy kết bạn với người này chứ?'
          mainBtnLabel='Đồng ý'
          action={()=> handleUnAccept()}
          closeModal={closeModal2}
        />
      </Modal>
      <div className='flex flex-col'>
      {data?.data.follow ? (
        <Button
          className='dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5 
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Bỏ_theo_dõi"] inner:hover:hidden dark:border-light-secondary'
          onClick={preventBubbling(openModal1)}
        >
          <span>{FollowButtonType.FOLLOWING_BUTTON}</span>
        </Button>
      ) : (
        <Button
          className='self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
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
      {data?.data.friend ? (
        <Button
          className='dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5 
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Hủy_kết_bạn"] inner:hover:hidden dark:border-light-secondary'
          onClick={preventBubbling(openModal2)}
        >
          <span>{FollowButtonType.FRIENDED_BUTTON}</span>
        </Button>
      ) : 
      data?.data.pending ? (
        <Button
        className='self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                   focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                   dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                   dark:active:bg-light-border/75 min-w-[120px]'
      >
        {FollowButtonType.PENDING_BUTTON}
      </Button>
      )
      :
      (
        <Button
          className='self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75 min-w-[120px]'
          onClick={preventBubbling(()=>{
            handleAccept();
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
