
import { preventBubbling } from '@lib/utils';
import { Button } from '@components/ui/button';
import {
    acceptFriend,unAcceptFriend
} from 'services/realtime/ServerAction/friendsService';
import { useUser } from 'context/user-context';
import { FollowButtonType } from '@models/notifications';
import {Typography} from "antd";
import {useRecoilValue} from "recoil";
import {mutateFriendRequest} from "@lib/hooks/mutateFriendRequest";

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
    const mutateFriendRequests = useRecoilValue(mutateFriendRequest);
    const handleAcceptFriend = async () =>{
        const data = {
            userId: currentUser?.id as string,
            friendId: userTargetId
        }
        if (mutateFriendRequests) {
               await acceptFriend(data);
                   await  mutateFriendRequests();
        }
    }

    const handleRejectFriend = async () =>{
        const data = {
            userId: currentUser?.id as string,
            friendId: userTargetId
        }
        if (mutateFriendRequests) {
               await unAcceptFriend(data);
               await mutateFriendRequests();
        }
    }

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
