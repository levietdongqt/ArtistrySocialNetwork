'use client'
import {Conversations} from "@components/chat-box/conversations";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import ChatBox from "@components/chat-box/chat-box";
import React, {useEffect, useState} from "react";
import {MyTooltip} from "@components/ui/my-tooltip";
import {Badge} from 'antd';
import {MessageTwoTone} from "@ant-design/icons";
import {useUser} from "../../context/user-context";
import {findUnReadConversations} from "../../services/realtime/clientRequest/conversationClient";
import {MyResponse} from "@models/responseObject";
import {ConversationDto} from "@models/conversation";
import {usePathname} from "next/navigation";

export function ChatAlert() {
    const isInMessagePage = usePathname() === "/message"
    const {currentUser} = useUser()
    const {state, dispatch} = useChat()
    const {conversations, showConversations, showChatBoxes, pickedConversations, showChatAlert} = state
    const [minus, setMinus] = useState<boolean[]>([false, false, false])
    const [unReadNumber, setUnReadNumber] = useState(0)

    useEffect(() => {
        if (!isInMessagePage) {
            findUnReadConversations().then((response: MyResponse<ConversationDto[]>) => {
                console.log("UNREAD: ", response)
                dispatch(ChatAction(response.data, ACTION_TYPE.SET_CONVERSATIONS))
            })
        }
    }, []);

    useEffect(() => {
        const unReadCount = conversations.reduce((result, currentValue) => {
            let unReadCount = currentValue.memberMap?.get(currentUser?.id!)?.notSeen! ? 1 : 0
            return result + unReadCount;
        }, 0)
        setUnReadNumber(unReadCount)
    }, [conversations]);
    return !isInMessagePage && (
        <div className="relative z-10"> {/* Đặt một z-index cho container nếu cần */}
            <div className="fixed  bottom-10 right-5 mb-4 ml-3 p-2 rounded">
                {showConversations && (
                    <div className={'fixed  bottom-12 right-2 mb-4 p-2 z-50'}>
                        <Conversations
                            closeConversations={() => dispatch(ChatAction(null, ACTION_TYPE.SHOW_CONVERSATIONS))}/>
                    </div>
                )}
                <div className={"flex-col "}>
                    {
                        showChatBoxes.map((showChatBox, index) => {
                            let isMinus: boolean = false
                            if (!showChatBox && pickedConversations[index]) {
                                isMinus = true
                            }
                            return isMinus &&
                                <div className={`my-1 ml-2 `}>
                                    <ChatBox isMinusChatBox={isMinus}
                                             curConversation={pickedConversations[index]!}/>
                                </div>

                        })
                    }
                    <MyTooltip content={"Danh sách trò chuyện"}>
                        <Badge count={unReadNumber} className={"fixed bottom-0 right-4 mb-5 mt-4 mr-3 "}>
                            <MessageTwoTone className={""} style={{fontSize: '40px'}} onClick={() => {
                                dispatch(ChatAction(null, ACTION_TYPE.SHOW_CONVERSATIONS))
                            }}/>
                        </Badge>
                    </MyTooltip>

                </div>
                <div className="flex bottom-0 fixed right-12 px-2 pb-1 mr-4 z-20">
                    {showChatBoxes.map((showChatBox, index) => {
                        return showChatBox &&
                            <div key={index}
                                 className={`w-[calc(33.3333% - 0.5rem)] 
                                 ml-1
                                  `}>
                                <ChatBox curConversation={pickedConversations[index]!}/>
                            </div>
                    })}
                </div>
            </div>
        </div>
    )
}