'use client'

import {Dropdown, MenuProps} from "antd";
import {InfoButton} from "@chatscope/chat-ui-kit-react";
import React, {useState} from "react";
import {CustomIcon, IconName,} from "@components/ui/custom-icon";
import Link from "next/link";
import {ConversationDto, ConversationMember} from "@models/conversation";
import {useUser} from "../../context/user-context";
import {Modal} from "../../app/(users)/_components/modal/modal";
import {ModalModifyNickname} from "@components/chat-box/modal-modify-nickname";
import {CreateGroupChat} from "@components/chat-box/modal-create-group";
import Swal from "sweetalert2";
import {deleteConversationAndMessagesBelong, outGroup} from "../../services/realtime/clientRequest/conversationClient";
import {toast} from "react-toastify";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";

interface props {
    conversation: ConversationDto,
    otherMembers: ConversationMember[],
    isInMessage: boolean,
    isGroup: boolean
}

interface navProps {
    href: string,
    iconName: IconName,
    label: string,
    callback?: () => void
}

export function ConversationHeaderDropdown({isInMessage, isGroup, conversation, otherMembers}: props) {

    const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false)
    const [openModifyNickName, setOpenModifyNickName] = useState(false)

    const {currentUser} = useUser()
    const isGroupMember = isGroup && !conversation.memberMap?.get(currentUser?.id!)?.isGroupOwner;
    const {state: {pickedConversations, showChatBoxes, conversations}, dispatch} = useChat()
    const handleDeleteConversation = () => {
        Swal.fire({
            title: "Bạn đã chắc chắn?",
            text: isGroupMember ? "Bạn sẽ thoát khỏi nhóm này!" : "Hành động này sẽ toàn bộ đoạn chat và không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Quay lại"
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(isGroupMember ? outGroup(conversation.id) : deleteConversationAndMessagesBelong({
                    id: conversation.id,
                    members: conversation.members,
                    type: conversation.type
                }), {
                    pending: "Đang xóa...",
                    success: "Xóa thành công!",
                    error: "Xóa thất bại!"
                }).then(() => {
                    const pickedIndex = pickedConversations.findIndex(item => item?.id === conversation.id)
                    let newPicked = [...pickedConversations]
                    newPicked.splice(pickedIndex, 1)
                    newPicked = [...newPicked, undefined]
                    dispatch(ChatAction(newPicked, ACTION_TYPE.SET_PICKED_CONVERSATIONS))

                    let newShowChatBox = [...showChatBoxes]
                    newShowChatBox.splice(pickedIndex, 1)
                    newShowChatBox = [...newShowChatBox, false]
                    dispatch(ChatAction(newShowChatBox, ACTION_TYPE.SHOW_CHAT_BOXES))

                    let conversationIndex = conversations.findIndex(item => item?.id === conversation.id)
                    const newConversations = [...conversations]
                    newConversations.splice(conversationIndex, 1)
                    dispatch(ChatAction(newConversations, ACTION_TYPE.SET_CONVERSATIONS))
                })
            }
        });

    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            disabled: isInMessage,
            label: (
                <TemplateNav href={`/message?id=${conversation.id}`}
                             iconName={'IconFacebookMessengerAlt'}
                             label={"Mở trong trang"}/>
            ),
        },
        {
            key: '2',
            disabled: isGroup,
            label: (
                <TemplateNav href={`/profile/${otherMembers[0].id}`}
                             iconName={'IconBxsUserCircle'}
                             label={"Trang cá nhân"}/>
            ),
        },
        {
            key: '3',
            disabled: isGroup && !conversation.memberMap?.get(currentUser?.id!)?.isGroupOwner,
            label: (
                <TemplateNav href={''}
                             callback={() => setOpenCreateGroupModal(true)}
                             iconName={'IconUserGroupAdd'}
                             label={isGroup ? "Quản lý nhóm" : "Tạo nhóm"}/>
            ),
        },
        {
            key: '4',
            label: (
                <TemplateNav href={''}
                             callback={() => setOpenModifyNickName(true)}
                             iconName={'IconBxsPencil'}
                             label={"Biệt danh"}/>
            ),
        },
        {
            key: '5',
            label: (
                <TemplateNav href={''}
                             callback={handleDeleteConversation}
                             iconName={'IconTrash3Fill'}
                             label={isGroupMember ? "Thoát nhóm" : "Xoá đoạn chat"}/>
            ),
        },
    ]

    return <>
        <Modal modalClassName='max-w-xl bg-main-background w-[35vw] p-8 rounded-2xl hover-animation'
               open={openModifyNickName}
               closeModal={() => setOpenModifyNickName(false)}>
            <ModalModifyNickname conversation={conversation}/>
        </Modal>
        <Modal modalClassName='max-w-xl bg-main-background h-[50vh] w-[30vw] p-8 rounded-2xl hover-animation'
               open={openCreateGroupModal}
               closeModal={() => setOpenCreateGroupModal(false)}>
            <CreateGroupChat conversation={conversation} closeModal={() => setOpenCreateGroupModal(false)}/>
        </Modal>
        <Dropdown menu={{items}} placement="bottom" arrow={true}>
            <button className="relative overflow-hidden">
                            <span
                                className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                            </span>
                <InfoButton/>
            </button>
        </Dropdown>
    </>

}

const TemplateNav = ({iconName, label, href, callback}: navProps) => {
    const noAction = () => {
    }
    return <Link href={href}
                 className={"flex "}
                 onClick={() => {
                     callback ? callback() : noAction()
                 }}>
        <CustomIcon iconName={iconName}/>
        <span className={'pl-3'}>{label}</span>
    </Link>
}

