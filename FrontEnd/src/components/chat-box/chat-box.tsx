'use client'
import {
    Avatar,
    ChatContainer,
    ConversationHeader,
    Message,
    MessageInput,
    MessageList,
    TypingIndicator,
    VideoCallButton,
    VoiceCallButton,
    AddUserButton,
    ArrowButton,
    EllipsisButton
} from "@chatscope/chat-ui-kit-react";
import React, {useEffect, useState} from "react";
import {useSocket} from "../../context/websocket-context1";
import {MessageDto} from "@models/message";
import {ConversationDto, ConversationMember} from "@models/conversation";
import {useUser} from "../../context/user-context"
import {getMessageDirection, getReceiverIds, MyMessageSeparator} from "@components/chat-box/chat-box-helper";
import {useChat} from "../../context/chat-context";
import {dateParse} from "@lib/helper/dateParse";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import {CustomIcon} from "@components/ui/custom-icon";
import {ToolTip} from "@components/ui/tooltip";
import {MyTooltip} from "@components/ui/my-tooltip";


interface ChatBoxProps {
    closeChatBox?: () => void; // The callback prop is an optional function
    curConversation: ConversationDto | undefined
}

export default function ChatBox({closeChatBox, curConversation}: ChatBoxProps) {
    const {currentUser} = useUser();
    const [memberMap, setMemberMap] = useState(new Map<string, ConversationMember>())
    const {state, dispatch, reRender} = useChat()
    const {pickedConversations, showChatBoxes} = state!;
    const {stompClient} = useSocket();
    const [isLoading, setIsLoading] = useState(true)
    const handleCloseChatBox = () => {
        closeChatBox?.();
    }
    useEffect(() => {
        const a = stompClient?.subscribe(`/user/chat/conversation`, (message) => {
            const messages: MessageDto[] = JSON.parse(message.body, dateParse)
            console.log("Callback from chatBox: ", curConversation?.messages?.length)
            dispatch(ChatAction(messages, ACTION_TYPE.SET_NEW_MESSAGES))
            setIsLoading(false)
        });
        console.log("Subscribe success")
        return () => {
            a?.unsubscribe()
            console.log("Unsubscribe success")
        }
    }, []);


    useEffect(() => {
        console.log("CHANGE MEMBER CONVERSATION")
        if (curConversation) {
            // const payload = {
            //     conversationId: curConversation?.id,
            //     senderId: currentUser!.id
            // }
            // stompClient?.send("/app/chat.getConversation", JSON.stringify(payload))
            handleMembersConversation()
        }
    }, [curConversation]);

    const sendMessage = (innerHtml: string) => {
        const message: MessageDto = {
            content: innerHtml,
            seen: false,
            sendTime: new Date(Date.now()),
            senderId: currentUser!.id,
            type: "text",
            conversationId: curConversation?.id,
        }
        const payload = {
            members: curConversation?.members,
            name: curConversation?.name,
            id: curConversation?.id!,
            messages: [message]
        }
        console.log("ONSUBMIT send message")
        stompClient?.send("/app/chat.sendPrivate", JSON.stringify(payload))
    }

    const handleShowAvatar = (timeDifference: number | undefined, sender: ConversationMember, prevMessage: MessageDto | null) => {
        if (sender.id === currentUser?.id) {
            return null;
        }
        if (!timeDifference || sender?.id !== prevMessage?.senderId || timeDifference >= 60)
            return < Avatar name={sender?.nickname}
                            src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"/>
        else {
            return < Avatar hidden={true}/>
        }

    }

    function handleMembersConversation() {
        const members = new Map<string, ConversationMember>();
        curConversation!.members?.map(value => {
            members.set(value.id, value)
        })
        setMemberMap(members)
    }

    const onClickCloseMessage = () => {
        const currIndex = pickedConversations.findIndex(value => value?.id === curConversation?.id)
        const newPickedConversations = [...pickedConversations]
        newPickedConversations[currIndex] = undefined
        const newShowChatBoxes = [...showChatBoxes]
        newShowChatBoxes[currIndex] = false
        dispatch(ChatAction(newPickedConversations, ACTION_TYPE.SET_PICKED_CONVERSATION))
        dispatch(ChatAction(newShowChatBoxes, ACTION_TYPE.SHOW_CHAT_BOXES))
    }

    if (!curConversation) {
        return (
            <div>
                <div className={"flex justify-center items-center h-screen"}>
                    <div className={"text-center"}>
                        Hãy kết nối bạn bè và trò chuyện ngay!
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <ChatContainer className={"border-2 overflow-auto"}
            >
                <ConversationHeader>
                    {/*<ConversationHeader.Back onClick={handleCloseChatBox}/>*/}
                    <Avatar
                        name={curConversation?.members?.filter(memberMap => memberMap.id !== currentUser?.id).pop()?.fullName}
                        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                    />
                    <ConversationHeader.Content
                        title={"HELLO"}
                        info="Active 10 mins ago"
                        userName={curConversation?.members?.filter(memberMap => memberMap.id !== currentUser?.id).pop()?.nickname}
                    />
                    <ConversationHeader.Actions>
                        {/*<VoiceCallButton/>*/}
                        {/*<VideoCallButton/>*/}
                        {/*<InfoButton/>*/}
                        <MyTooltip content={"Thu nhỏ"}>
                            <button className="relative overflow-hidden">
                            <span
                                className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                            </span>
                                <CustomIcon iconName={"MinusIcon"}/>
                            </button>
                        </MyTooltip>
                        <MyTooltip content={"Đóng"}>
                            <button className="relative overflow-hidden" onClick={onClickCloseMessage}>
                                <span
                                    className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                                </span>
                                <CustomIcon iconName={"CloseMessage"}/>
                            </button>
                        </MyTooltip>
                    </ConversationHeader.Actions>
                </ConversationHeader>
                <MessageList
                    scrollBehavior="smooth"
                    loadingMore={false}
                    autoScrollToBottom={true}
                    disableOnYReachWhenNoScroll={true}
                    loading={isLoading}
                    loadingMorePosition={"top"}
                    typingIndicator={<TypingIndicator content="Zoe is typing"/>}

                >
                    {!isLoading ?
                        <MessageList.Content
                            className="flex flex-col justify-end  h-full pb-10 text-center text-lg"
                        >
                            {
                                curConversation?.messages?.map((message, index) => {
                                    const sender: ConversationMember = memberMap.get(message.senderId)!
                                    const prevMessage: MessageDto | undefined = index > 0 ? curConversation.messages?.[index - 1] : undefined
                                    // console.log("current time: ", message.sendTime.toLocaleDateString())
                                    let timeDifference: number | undefined = undefined;
                                    if (prevMessage) {
                                        timeDifference = (message.sendTime.getTime() - prevMessage.sendTime.getTime()) / (1000 * 60);
                                    }
                                    return (
                                        <div className={"items-center"} key={index}>
                                            <MyMessageSeparator timeDifference={timeDifference}
                                                                currentTime={message.sendTime}/>
                                            <Message
                                                className={"rounded-md text-xs"}
                                                model={{
                                                    direction: getMessageDirection(message.senderId, currentUser!.id),
                                                    message: message.content,
                                                    position: 'first',
                                                    type: message.type,
                                                    sender: "Dong",
                                                    sentTime: '15 mins ago'
                                                }}
                                            >
                                                {
                                                    handleShowAvatar(timeDifference, sender, prevMessage!)
                                                    // (message.senderId === currentUser?.id || sender?.id !== prevMessage?.senderId) ?
                                                    //     null :
                                                    //     < Avatar status={"invisible"} name={sender?.nickname}
                                                    //              src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"/>

                                                }
                                            </Message>

                                        </div>
                                    )
                                })
                            }
                        </MessageList.Content>
                        :
                        <MessageList className={"mt-10 mx-auto"}
                        >
                            <MessageList.Content className={"mx-auto"}>
                                Bắt đầu trò trò chuyện ngay
                            </MessageList.Content>
                        </MessageList>

                    }
                </MessageList>
                <div is={"MessageInput"} className={"flex items-center"}>
                    <MessageInput placeholder="Type message here"
                                  onSend={sendMessage}/>
                    <CustomIcon iconName={"MinusIcon"}/>

                </div>
            </ChatContainer>
        </>
    )
}