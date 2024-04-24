'use client'
import {CustomIcon} from "@components/ui/custom-icon";
import {Conversations} from "@components/chat-box/conversations";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import ChatBox from "@components/chat-box/chat-box";
import React from "react";
import {MyTooltip} from "@components/ui/my-tooltip";
import {MainContainer} from "../../app/(users)/_components/home/main-container";
import {Avatar, Badge, Space} from 'antd';
import {MessageOutlined, MessageTwoTone} from "@ant-design/icons";

export function ChatAlert() {
    const {state, dispatch} = useChat()
    const {showConversations, showChatBoxes, pickedConversations} = state
    return (
        <div className="relative z-10"> {/* Đặt một z-index cho container nếu cần */}
            <div className="fixed bottom-10 right-5 mb-4 ml-4 p-2 rounded">
                {showConversations && (
                    <div className={'fixed  bottom-12 right-2 mb-2 p-2 z-50'}>
                        <Conversations
                            closeConversations={() => dispatch(ChatAction(null, ACTION_TYPE.SHOW_CONVERSATIONS))}/>
                    </div>
                )}
                <MyTooltip content={"Danh sách trò chuyện"}>
                    <Badge count={7} className={"fixed bottom-0 right-4 mb-5  mr-3 "}>
                        <MessageTwoTone className={""} style={{fontSize: '32px'}} onClick={() => {
                            dispatch(ChatAction(null, ACTION_TYPE.SHOW_CONVERSATIONS))
                        }}/>
                    </Badge>
                </MyTooltip>
                <div className="flex bottom-0 fixed right-12 px-2 pb-1 mr-4 z-40 h-[60%]">
                    {showChatBoxes.map((conversation, index) => (
                        conversation &&
                        <div key={index} className={`w-[calc(33.3333% - 0.5rem)] ml-${index > 0 ? '1' : '0'} `}>
                            <ChatBox curConversation={pickedConversations[index]!}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}