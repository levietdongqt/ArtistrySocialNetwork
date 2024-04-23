'use client'
import {Avatar, Conversation, ConversationList, Search, Sidebar} from "@chatscope/chat-ui-kit-react";
import React, {useState} from "react";
import {CustomIcon} from "@components/ui/custom-icon";
import useSWR from "swr";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {getConversationByUserId} from "../../services/realtime/clientRequest/conversationClient";
import {useUser} from "../../context/user-context";
import {ConversationDto, ConversationMember} from "@models/conversation";
import {useChat} from "../../context/chat-context";
import {useSocket} from "../../context/websocket-context1";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import {handlePickedConversations} from "@components/chat-box/chat-box-helper";
import {usePathname} from 'next/navigation'
import {MyTooltip} from "@components/ui/my-tooltip";

interface ConversationsProps {
    closeConversations?: () => void; // The callback prop is an optional function
}

export function Conversations({closeConversations}: ConversationsProps) {
    const {state, dispatch, setReRender} = useChat()
    const isInMessagePage = usePathname() === "/message"
    const {conversations, showChatBoxes, pickedConversations} = state
    const {stompClient} = useSocket()
    const {currentUser} = useUser()
    const handleCloseConversations = () => {
        closeConversations?.();
    }
    const {
        isLoading,
    } = useSWR(currentUser && getConversationByUserId(currentUser.id), fetcherWithToken, {
        revalidateOnFocus: false,
        refreshInterval: 0,
        onSuccess: response => {
            dispatch(ChatAction(response.data, ACTION_TYPE.SET_CONVERSATIONS))
            // const newPickedConversations = [...pickedConversations]
            // newPickedConversations[0] = response.data[0]
            // dispatch(ChatAction(newPickedConversations, ACTION_TYPE.SET_PICKED_CONVERSATION))
            // if (!curConversation) {
            //    dispatch(ChatAction(response.data[0],ACTION_TYPE.SET_CUR_CONVERSATION))
            // }
        }
    })

    const onPickConversation = (curConversation: ConversationDto) => {
        console.log("onPickConversation", pickedConversations, curConversation)
        const newShowChatBoxes = [...showChatBoxes]
        const curIndex = pickedConversations.findIndex(value => value?.id === curConversation.id);
        //Conversation was picked and is showing
        if (curIndex !== -1 && showChatBoxes[curIndex]) {
            console.log("Conversation is existing")
            return
        }
        //Conversation was picked and not showing
        if (curIndex !== -1 && !showChatBoxes[curIndex]) {
            newShowChatBoxes[curIndex] = true
        } else {
            const newPickedCon = handlePickedConversations(curConversation, pickedConversations)
            dispatch(ChatAction(newPickedCon, ACTION_TYPE.SET_PICKED_CONVERSATION))
            const newIndex = newPickedCon.findIndex(value => value?.id === curConversation.id)
            newShowChatBoxes[newIndex] = true
        }
        dispatch(ChatAction(newShowChatBoxes, ACTION_TYPE.SHOW_CHAT_BOXES))
        setReRender(prev => prev + 1)
        const payload = {
            conversationId: curConversation.id,
            senderId: currentUser!.id
        }
        console.log("Getting conversation")
        stompClient?.send("/app/chat.getConversation", JSON.stringify(payload))
    }

    return (
        <>
            <Sidebar className={isInMessagePage ? "" : "rounded-2xl border-2"}
                     position="left"
            >
                <div className={'flex items-center'}>
                    <Search placeholder="Search..."/>
                    {/*<button onClick={handleCloseConversations}>*/}
                    {/*    <CustomIcon iconName={"CloseIcon"}/>*/}
                    {/*</button>*/}
                </div>
                {conversations &&
                    <ConversationList loading={isLoading} key={"sdf"}>
                        {
                            conversations?.map((conversation: ConversationDto, index: number) => {
                                const lastSender: ConversationMember | undefined = conversation.memberMap?.get(conversation?.lastMessage?.senderId)
                                const isOwnerLastMessage: boolean = lastSender?.id === currentUser?.id
                                const isGroup: boolean = conversation.memberMap?.size !== 2
                                const otherMembers = conversation.members.filter(value => value.id !== currentUser?.id)
                                return (
                                    <>
                                        <Conversation key={conversation.id}
                                                      info={conversation.lastMessage.content.substring(0, 20)}
                                                      lastSenderName={isOwnerLastMessage ? "Bạn" : lastSender?.nickname}
                                                      name={!isGroup ? otherMembers[0].nickname : "Group chat"}
                                                      onClick={() => onPickConversation(conversation)}
                                        >
                                            {
                                                !isGroup &&
                                                <Avatar key={index}
                                                        title={otherMembers[0].fullName ? otherMembers[0].fullName : ""}
                                                        name={otherMembers[0].nickname}
                                                        src={otherMembers[0].avatar ? otherMembers[0].avatar : "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"}
                                                        status="available"
                                                />
                                            }
                                        </Conversation>
                                    </>
                                )
                            })
                        }
                    </ConversationList>
                }
            </Sidebar>
            {/*{pickedConversations[0] && (*/}
            {/*    <div className={'fixed  bottom-0   translate-x-[-100%]  p-2 z-50 h-[60%]'}>*/}
            {/*        fixed bottom-5 right-full translate-x-[-100%] mb-2 p-2 z-50*/}
            {/*        <ChatBox curConversation={pickedConversations[0]}/>*/}
            {/*    </div>*/}

            {/*)}*/}

        </>

    )
}