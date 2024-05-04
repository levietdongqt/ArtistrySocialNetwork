import {Badge, Tooltip} from "antd";
import {Avatar} from "@chatscope/chat-ui-kit-react";
import {CustomIcon} from "@components/ui/custom-icon";
import React, {useState} from "react";
import {ConversationDto, ConversationMember} from "@models/conversation";
import {useUser} from "../../context/user-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import {useChat} from "../../context/chat-context";
import MyAvatarGroup from "@components/chat-box/AvatarGroup";

interface MiniChatBoxProps {
    curConversation: ConversationDto,
    onClickCloseMessage: () => void,
    onClickMinusChatBox: (status: boolean) => void
}

export default function MiniChatBox({curConversation, onClickCloseMessage, onClickMinusChatBox}: MiniChatBoxProps) {
    const [isShowCloseMinus, setIsShowCloseMinus] = useState(false)
    const {currentUser} = useUser();
    const lastMessage = curConversation.lastMessage
    const sender = curConversation.lastMessage && curConversation.memberMap?.get(lastMessage!.senderId)
    const currentMember = curConversation.memberMap?.get(currentUser?.id!)
    const otherMembers = curConversation?.members?.filter(memberMap => memberMap.id !== currentUser?.id);
    const toolTipTitle = sender ?
        `${sender?.id === currentUser?.id ? 'Bạn' : sender?.nickname}: ${lastMessage!.content}`
        : (curConversation.name || otherMembers[0].nickname)
    console.log("Mini ChatBox: ", curConversation)
    return (
        <>
            <Badge count={currentMember?.notSeen ? 1 : 0} className={""}>
                <Tooltip
                    title={toolTipTitle}
                    placement="left"
                    onOpenChange={(isOpen) => {
                        setIsShowCloseMinus(isOpen)
                    }}
                >
                    <div className="relative z-20">
                        <MyAvatarGroup onClick={() => onClickMinusChatBox(true)} members={otherMembers}/>
                        {isShowCloseMinus && (
                            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-5">
                                <button className="relative overflow-hidden" onClick={onClickCloseMessage}>
                                    <span
                                        className="block w-full h-60% bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50"></span>
                                    <CustomIcon iconName="CloseOIcon"/>
                                </button>
                            </div>
                        )}
                    </div>
                </Tooltip>
            </Badge>
        </>
    )
}