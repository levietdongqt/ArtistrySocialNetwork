'use client'
import {
    Avatar,
    ChatContainer,
    ConversationHeader,
    // InfoButton,
    Message,
    MessageInput,
    MessageList,
    MessageSeparator,
    TypingIndicator,
    VideoCallButton,
    VoiceCallButton
} from "@chatscope/chat-ui-kit-react";
import React, {useEffect, useRef, useState} from "react";
import {useSocket} from "../../context/websocket-context1";
import {MessageDto} from "../../models/message";
import {ConversationDto, ConversationMember} from "../../models/conversation";
import {useUser} from "../../context/user-context"
import {getMessageDirection, getReceiverIds, MyAvatar, MyMessageSeparator} from "@components/chat-box/chat-box-helper";
import {useChat} from "../../context/chat-context";
import {dateParse} from "@lib/helper/dateParse";


interface ChatBoxProps {
    closeChatBox?: () => void; // The callback prop is an optional function
}

export default function ChatBox({closeChatBox}: ChatBoxProps) {
    const {currentUser} = useUser();
    const [memberMap, setMemberMap] = useState(new Map<string, ConversationMember>())
    const {curConversation, setMessages, reRender, setReRender} = useChat()
    const {stompClient} = useSocket();
    const [isLoading, setIsLoading] = useState(true)
    const handleCloseChatBox = () => {
        closeChatBox?.();
    }
    useEffect(() => {
        const a = stompClient?.subscribe(`/user/chat/conversation`, (message) => {
            const messages: MessageDto[] = JSON.parse(message.body, dateParse)
            console.log("Callback from chatBox: ", curConversation?.messages?.length)
            setMessages(messages)
            setIsLoading(false)
        });
        console.log("Subscribe success")
        const payload = {
            conversationId: curConversation?.id,
            senderId: currentUser!.id
        }
        stompClient?.send("/app/chat.getConversation", JSON.stringify(payload))
        return () => {
            a?.unsubscribe()
            console.log("Unsubscribe success")
        }
    }, []);


    useEffect(() => {
        if (curConversation) {
            handleMembersConversation()
        }
    }, [reRender]);

    const sendMessage = (innerHtml: string) => {
        const payload: MessageDto = {
            content: innerHtml,
            seen: false,
            sendTime: new Date(Date.now()),
            senderId: currentUser!.id,
            type: "text",
            conversationId: curConversation?.id,
            receiverIds: getReceiverIds(curConversation!)
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
        curConversation!.members.map(value => {
            members.set(value.id, value)
        })
        setMemberMap(members)
    }

    return (
        <>
            <ChatContainer
            >
                <ConversationHeader>
                    <ConversationHeader.Back onClick={handleCloseChatBox}/>
                    <Avatar
                        name={curConversation?.members.filter(memberMap => memberMap.id !== currentUser?.id).pop()?.fullName}
                        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                    />
                    <ConversationHeader.Content
                        title={"HELLO"}
                        info="Active 10 mins ago"
                        userName={curConversation?.members.filter(memberMap => memberMap.id !== currentUser?.id).pop()?.nickname}
                    />
                    <ConversationHeader.Actions>
                        <VoiceCallButton/>
                        <VideoCallButton/>
                        {/*<InfoButton/>*/}
                    </ConversationHeader.Actions>
                </ConversationHeader>
                <MessageList
                    scrollBehavior="smooth"
                    loadingMore={false}
                    autoScrollToBottom={true}
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
                                    const prevMessage: MessageDto | null = index > 0 ? curConversation.messages[index - 1] : null
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
                                                className={"rounded-md"}
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
                                                    handleShowAvatar(timeDifference, sender, prevMessage)
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

                            {/*<Message*/}
                            {/*    model={{*/}
                            {/*        direction: 'outgoing',*/}
                            {/*        message: 'Hello',*/}
                            {/*        position: 'single',*/}
                            {/*        sender: 'Zoe',*/}
                            {/*        sentTime: '15 mins ago'*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <Avatar*/}
                            {/*        name="Zoe"*/}
                            {/*        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"*/}
                            {/*    />*/}
                            {/*</Message>*/}
                            {/*<Message*/}
                            {/*    avatarSpacer*/}
                            {/*    model={{*/}
                            {/*        direction: 'outgoing',*/}
                            {/*        message: 'Hello sdsfdsfsdfkj ksdfksjdhf ksfbkds ksfdkjhsd kjhdsfkhdsf sjfdhksjhfskjdhfkshfks  sdfksjdh dsdadasadadasdadads',*/}
                            {/*        position: 'single',*/}
                            {/*        sender: 'Patrik',*/}
                            {/*        sentTime: '15 mins ago',*/}
                            {/*    }}*/}
                            {/*/>*/}
                            {/*<Message*/}
                            {/*    avatarSpacer*/}
                            {/*    model={{*/}
                            {/*        direction: 'incoming',*/}
                            {/*        message: 'Hello my friend',*/}
                            {/*        position: 'single',*/}
                            {/*        sender: 'Patrik',*/}
                            {/*        sentTime: '15 mins ago',*/}
                            {/*    }}*/}
                            {/*/>*/}
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

                <MessageInput placeholder="Type message here"
                              onSend={sendMessage}/>
            </ChatContainer>
        </>
    )
}