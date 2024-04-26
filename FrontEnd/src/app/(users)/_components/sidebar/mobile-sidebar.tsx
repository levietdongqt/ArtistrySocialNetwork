'use client'
import { useModal } from '@lib/hooks/useModal';
import { Button } from '@components/ui/button';
import { Modal } from '../modal/modal';
import { MobileSidebarModal } from '../modal/mobile-sidebar-modal';
import { UserAvatar } from '../user/user-avatar';
import type { Variants } from 'framer-motion';
import {useUser} from "../../../../context/user-context";

const variant: Variants = {
  initial: { x: '-100%', opacity: 0.8 },
  animate: {
    x: -8,
    opacity: 1,
    transition: { type: 'spring', duration: 0.8 }
  },
  exit: { x: '-100%', opacity: 0.8, transition: { duration: 0.4 } }
};

export function MobileSidebar(): JSX.Element {
const {currentUser} = useUser()
  /*const { photoURL, name } = user as User;*/

  const { open, openModal, closeModal } = useModal();

  return (
    <>
      {/*<Modal*/}
      {/*  className='p-0'*/}
      {/*  modalAnimation={variant}*/}
      {/*  modalClassName='pb-4 pl-2 min-h-screen w-72 bg-main-background'*/}
      {/*  open={open}*/}
      {/*  closeModal={closeModal}*/}
      {/*>*/}
      {/*  /!*<MobileSidebarModal {...(user as User)} closeModal={closeModal} />*!/*/}
      {/*  /!*<MobileSidebarModal closeModal={closeModal} />*!/*/}
      {/*</Modal>*/}
      <Button className='accent-tab p-0 xs:hidden' onClick={openModal}>
        <UserAvatar src={currentUser?.avatar!} alt={currentUser?.fullName!} size={30} />
      </Button>
    </>
  );
}
