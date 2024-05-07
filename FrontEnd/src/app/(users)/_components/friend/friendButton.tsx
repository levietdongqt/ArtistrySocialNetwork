
import { useModal } from '@lib/hooks/useModal';
import { preventBubbling } from '@lib/utils';
import { Modal } from '../modal/modal';
import { ActionModal } from '../modal/action-modal';
import { Button } from '@components/ui/button';
import {
    acceptFriend,
    addFriend,
    followingFriend,
    isFollowing,
    removeFriend,
    returnAddFriend,
    unAcceptFriend,
    unFollowingFriend
} from 'services/main/clientRequest/friendsClient';
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

export function FriendButton({
                                 userTargetId,
                                 userTargetUsername,
                                 hovered,
                             }: FollowButtonProps): JSX.Element | null {
    const {currentUser} = useUser();
    const [shouldRejectFriend,setShouldRejectFriend] = useState(false);
    const [shouldAcceptFriend,setShouldAcceptFriend] = useState(false);
    //Xử lý follow
    console.log("show friends",userTargetId)
    console.log("show ủe",currentUser?.id as string)

//Xử lý kết bạn
    const {} = useSWR(
        shouldAcceptFriend?
            acceptFriend({
                userId: currentUser?.id as string,
                friendId: userTargetId
            }):null,
        fetcherWithToken
    );
    const {} = useSWR(
        shouldRejectFriend ?
            unAcceptFriend({
                userId: currentUser?.id as string,
                friendId: userTargetId
            }):null,
        fetcherWithToken
    )


    const handleAcceptFriend = () =>{
        setShouldAcceptFriend(true);
    }

    const handleRejectFriend = () =>{
        setShouldRejectFriend(true);
    }
    useEffect(()=>{
        if(shouldRejectFriend){
            setShouldRejectFriend(false);
        }
    },[shouldRejectFriend])

    useEffect(()=>{
        if(shouldAcceptFriend){
            setShouldAcceptFriend(false);
        }
    },[shouldAcceptFriend])


    return (
        <>
            <div className='flex flex-col'>
                <Button
                    className='self-start border bg-blue-400 px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border
     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90
     dark:active:bg-light-border/75 min-w-[120px]'
                    onClick={preventBubbling(()=>{
                        handleAcceptFriend();
                    })}
                >
                    {FollowButtonType.ACCEPT_FRIEND_BUTTON_BASIC}
                </Button>
                <Button
                    className='self-start border bg-accent-red px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                 focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border
                 dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90
                 dark:active:bg-light-border/75 min-w-[120px]'
                    onClick={preventBubbling(()=>{
                        handleRejectFriend();
                    })}
                >
                    {FollowButtonType.REJECT_FRIEND_BUTTON}
                </Button>


            </div>
        </>
    );
}
