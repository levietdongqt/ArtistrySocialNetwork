"use client"

import { useToast } from "@/components/alert/alert";
import { alertType } from "@/lib/constants";
import { Button } from "react-bootstrap";
import CustomModal from "@/components/modals/CreateModal";
import React, { useState } from 'react';
import { Post } from "@/components/modals/content/Post";

interface MyComponentProps  {
  callback1 : () => void;
}

interface User {
  id: number;
  name: string;
  avatar: string;
}

const user: User = {
  id : 1,
  name: "Huy Tran",
  avatar: "images.jpg"
}

export default function ClientTest(props : any) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const notify = () => useToast({ type: alertType.success, message: 'HELLO' });
  return (
    <>
          <Button onClick={notify}>Click Me</Button>
          <Button onClick={openModal}>Create Post</Button>

          <CustomModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
          >
            <Post User={user} CloseRequest={() => closeModal()}></Post>
          </CustomModal>
    </>
  )
}