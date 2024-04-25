
import { useModal } from '@lib/hooks/useModal';
import { preventBubbling } from '@lib/utils';
import { Modal } from '../../app/(users)/_components/modal/modal';
import { ActionModal } from '../../app/(users)/_components/modal/action-modal';
import { Button } from '@components/ui/button';
import { useUser } from 'context/user-context';
import { useEffect, useState } from 'react';
import { fetcherWithToken } from '@lib/config/SwrFetcherConfig';
import useSWR from 'swr';
import { NopeNotificationModel } from '@models/notifications';
import {Typography} from "antd";
import { checkNopeNotifications, deleteNopeNotifications, saveNopeNotifications } from 'services/main/clientRequest/notificationsClient';

const { Text } = Typography;

type NotificationButtonProps = {
  userTargetId: string;
  userTargetUsername: string;
  hovered:boolean;
};

export function NotificationButton({
  userTargetId,
  userTargetUsername,
  hovered,
  
}: NotificationButtonProps): JSX.Element | null {
    const {currentUser} = useUser();
    const { open, openModal, closeModal} = useModal();
    const [data,setData] = useState<NopeNotificationModel>();
    const [shouldSave,setShouldSave] = useState(false);
    const [shouldDelete,setShouldDelete] = useState(false);


    const {data:data2} = useSWR(
        hovered ? 
          checkNopeNotifications(
              currentUser?.id as string,
                {
                    userId:  currentUser?.id as string,
                    friendId: userTargetId,                
                }
            )
          : null,
        fetcherWithToken
      );
      

    const {} = useSWR(
        shouldSave
          ? saveNopeNotifications(
              currentUser?.id as string,
              data as NopeNotificationModel
            )
          : null,
        fetcherWithToken
      );
    useEffect(()=>{
        if(shouldSave){
            setShouldSave(false);
        }
    },[shouldSave])


    const {} = useSWR(
      shouldDelete
        ? deleteNopeNotifications(
            currentUser?.id as string,
            data as NopeNotificationModel
          )
        : null,
      fetcherWithToken
    );
  useEffect(()=>{
      if(shouldDelete){
          setShouldDelete(false);
      }
  },[shouldDelete])

    const handleNopeNotification = () =>{
            setData({
                userId: currentUser?.id ?? currentUser!.id,
                nopeId: userTargetId,
                nopeMinutesTime: 60 * 24,
            });
            setShouldSave(true);
            closeModal();
    }

    const handleDeleteNopeNotification = () =>{
      setData({
        userId: currentUser?.id ?? currentUser!.id,
        nopeId: userTargetId,
        nopeMinutesTime: 0,
      });
      setShouldDelete(true);
    }

  return (
    <>
      <Modal
        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          title={(currentUser?.id === userTargetId) ? "Bỏ chặn toàn bộ trong 24h" : `Bỏ chặn @${userTargetUsername}?`}
          description='Bạn có chắc là không nhận thông báo chứ?'
          mainBtnLabel='Đồng ý'
          action={()=> handleNopeNotification()}
          closeModal={closeModal}
        />
      </Modal>  
      <div className='flex flex-col '>
        {
          data2?.data ? (
            <Button
            className='dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5 
                       font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                       hover:before:content-["Bỏ_chặ_thông_báo"] inner:hover:hidden dark:border-light-secondary
                       '
            onClick={()=> handleDeleteNopeNotification()}
          >
            Đang chặn thông báo
          </Button>
          ) : (
            <Button
            className='dark-bg-tab min-w-[120px] self-start border border-light-line-reply 
            
            px-4 py-1.5 
                       font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red'
            onClick={preventBubbling(openModal)}
          >
            Chặn thông báo trong 24h
          </Button>
          )
        }  
        </div>
    </>
  );
}
