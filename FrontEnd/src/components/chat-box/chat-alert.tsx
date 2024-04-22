'use client'
import {CustomIcon} from "@components/ui/custom-icon";
import {Conversations} from "@components/chat-box/conversations";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import ChatBox from "@components/chat-box/chat-box";
import React from "react";
import {MyTooltip} from "@components/ui/my-tooltip";
import {MainContainer} from "../../app/(users)/_components/home/main-container";

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
                    <button className="fixed bottom-0 right-2 mb-4 ml-2 p-2 text-white rounded"
                            onClick={() => {
                                dispatch(ChatAction(null, ACTION_TYPE.SHOW_CONVERSATIONS))
                            }}>
                        <CustomIcon iconName="MessageIcon"/>
                    </button>
                </MyTooltip>
                <div className="flex bottom-0 fixed right-12 p-2 z-20 h-[60%]">
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