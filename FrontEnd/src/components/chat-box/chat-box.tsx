'use client'
import {Avatar, ChatContainer, Message, MessageInput, MessageList} from "@chatscope/chat-ui-kit-react";
import React, {memo, useEffect, useState} from "react";
import {useSocket} from "../../context/websocket-context1";
import {MessageDto} from "@models/message";
import {ConversationDto, ConversationMember} from "@models/conversation";
import {useUser} from "../../context/user-context"
import {
    getMessageDirection,
    handleFormatSendTime,
    isLastMessageOutGoing,
    MyMessageSeparator
} from "@components/chat-box/chat-box-helper";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import {CustomIcon} from "@components/ui/custom-icon";
import {Tooltip} from "antd";
import MiniChatBox from "@components/chat-box/mini-chat-box";
import MyConversationHeader from "@components/chat-box/conversation-header";
import {usePathname} from "next/navigation";
import {checkNotSeen, sendSeenFlag} from "@components/chat-box/chat-box-socket-helper";

interface ChatBoxProps {
    isMinusChatBox?: boolean; // The callback prop is an optional function
    curConversation: ConversationDto | undefined
}

function ChatBox({isMinusChatBox, curConversation}: ChatBoxProps) {
    const {currentUser} = useUser();
    const isInMessagePage = usePathname() === "/message"
    const {stompClient} = useSocket();
    const {state, dispatch, reRender} = useChat()

    const {pickedConversations, showChatBoxes, conversations} = state!;
    const [messageIdFooter, setMessageIdFooter] = useState("")
    const [isOnFocus, setIsOnFocus] = useState(false)
    const otherMembers = curConversation?.members?.filter(memberMap => memberMap.id !== currentUser?.id);

    useEffect(() => {
        console.log("CHAT box mount")
        // if (!curConversation) {
        //     console.log("SET CURRENT CONVERSATION")
        //     curConversation = conversations[0]
        // }
    }, []);

    useEffect(() => {
        console.log("ChatBox mount", curConversation)
        if (!curConversation?.messages) {
            const payload = {
                conversationId: curConversation?.id,
                senderId: currentUser!.id
            }
            console.log("Getting conversation", curConversation)
            stompClient?.publish({
                destination: "/app/chat.getConversation",
                body: JSON.stringify(payload)
            })
        }

    }, [curConversation]);

    useEffect(() => {
        if (curConversation && isOnFocus) {
            const isNotSeen = checkNotSeen(curConversation, currentUser!)
            if (isNotSeen) {
                sendSeenFlag(curConversation, stompClient!, currentUser!)
                dispatch(ChatAction(curConversation, ACTION_TYPE.UPDATE_CONVERSATION))
            }
        }
    }, [isOnFocus])

    const sendMessage = (innerHtml: string) => {
        const message: MessageDto = {
            content: innerHtml,
            seen: false,
            sendTime: new Date(Date.now()),
            senderId: currentUser!.id,
            type: "html",
            conversationId: curConversation?.id,
        }
        const members = curConversation?.members.map(member => {
            member.notSeen = member.id !== currentUser!.id;
            return member
        })
        const payload = {
            members: members,
            name: curConversation?.name,
            id: curConversation?.id!,
            type: curConversation?.type,
            messages: [message],
        }
        console.log("ONSUBMIT send message")
        stompClient?.publish({
            destination: "/app/chat.sendPrivate",
            body: JSON.stringify(payload)
        })
    }

    const handleShowAvatar = (timeDifference: number | undefined, sender: ConversationMember, prevMessage: MessageDto | null) => {
        if (sender.id === currentUser?.id) {
            return null;
        }
        if (!timeDifference || sender?.id !== prevMessage?.senderId || timeDifference >= 60)
            return (
                <div is={"Avatar"}>
                    <Tooltip title={sender.nickname} placement={"left"}>
                        < Avatar name={sender?.nickname}
                                 src={sender?.avatar}/>
                    </Tooltip>
                </div>
            )
        else {
            return < Avatar hidden={true}/>
        }

    }

    // function handleMembersConversation() {
    //     const members = new Map<string, ConversationMember>();
    //     curConversation!.members?.map(value => {
    //         members.set(value.id, value)
    //     })
    // }

    const onClickCloseMessage = () => {
        const currIndex = pickedConversations.findIndex(value => value?.id === curConversation?.id)
        const newPickedConversations = [...pickedConversations]
        newPickedConversations[currIndex] = undefined
        const newShowChatBoxes = [...showChatBoxes]
        newShowChatBoxes[currIndex] = false
        dispatch(ChatAction(newPickedConversations, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
        dispatch(ChatAction(newShowChatBoxes, ACTION_TYPE.SHOW_CHAT_BOXES))
    }


    const onShowMessageFooter = (messageId: string) => {
        if (messageId === messageIdFooter) {
            setMessageIdFooter("")
            return
        }
        setMessageIdFooter(messageId)
    }

    const onClickMinusChatBox = (toggle: boolean) => {
        const isNotSeen = checkNotSeen(curConversation!, currentUser!)
        if (isNotSeen) {
            sendSeenFlag(curConversation!, stompClient!, currentUser!)
            dispatch(ChatAction(curConversation, ACTION_TYPE.UPDATE_CONVERSATION))
        }  //
        const newShowChatBoxes = [...showChatBoxes]
        const currIndex = pickedConversations.findIndex(value => value?.id === curConversation?.id);
        newShowChatBoxes[currIndex] = toggle
        dispatch(ChatAction(newShowChatBoxes, ACTION_TYPE.SHOW_CHAT_BOXES))
    }

    const onFocusChatContainer = () => {
        if (isOnFocus) {
            return
        }
        const isNotSeen = checkNotSeen(curConversation!, currentUser!)
        if (isNotSeen) {
            sendSeenFlag(curConversation!, stompClient!, currentUser!)
            dispatch(ChatAction(curConversation, ACTION_TYPE.UPDATE_CONVERSATION))
        }
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

    if (isMinusChatBox) {
        return <>
            <MiniChatBox curConversation={curConversation}
                         onClickCloseMessage={onClickCloseMessage}
                         onClickMinusChatBox={onClickMinusChatBox}
            />
        </>
    }
    return (
        <>
            <ChatContainer className={"border-2 overflow-auto  "}
                           onClick={onFocusChatContainer}
                           style={isInMessagePage ? {fontSize: "16px", height: "100vh"} : {
                               fontSize: "16px",
                               borderTopLeftRadius: "20px",
                               borderTopRightRadius: "20px",
                               borderBottomLeftRadius: "10px",
                               borderBottomRightRadius: "10px",
                               boxShadow: "5px",
                               width: "20vw",
                               height: "60vh"
                           }}>

                <div is={"ConversationHeader"}>
                    <MyConversationHeader conversation={curConversation}
                                          otherMembers={otherMembers}
                                          onClickCloseMessage={onClickCloseMessage}
                                          onClickMinusChatBox={onClickMinusChatBox}/>
                </div>
                <MessageList
                    className="flex flex-col justify-end  h-full pb-3 text-center text-lg"
                    scrollBehavior="smooth"
                    loadingMore={false}
                    autoScrollToBottomOnMount={true}
                    autoScrollToBottom={true}
                    loading={!curConversation}
                    loadingMorePosition={"top"}
                    // typingIndicator={<TypingIndicator content="Zoe is typing"/>}

                >
                    {!!curConversation ?
                        (
                            curConversation?.messages?.map((message, index) => {
                                const sender: ConversationMember = curConversation?.memberMap?.get(message.senderId)!
                                const prevMessage: MessageDto | undefined = index > 0 ? curConversation?.messages?.[index - 1] : undefined
                                // console.log("current time: ", message.sendTime.toLocaleDateString())
                                let timeDifference: number | undefined = undefined;
                                if (prevMessage) {
                                    timeDifference = (message.sendTime.getTime() - prevMessage.sendTime.getTime()) / (1000 * 60);
                                }
                                return (
                                    <div className={"items-center"} key={index} is={"MessageGroup"}>
                                        <MyMessageSeparator timeDifference={timeDifference}
                                                            currentTime={message.sendTime}/>
                                        {/*    'twitter-chirp': ['TwitterChirp', 'sans-serif'],*/}
                                        {/*'twitter-chirp-extended': ['TwitterChirpExtendedHeavy', 'sans-serif']*/}
                                        <Message
                                            style={{
                                                display: 'flex',
                                                flex: "content",
                                                fontSize: "16px",
                                                marginBottom: "0px",
                                                marginTop: "1px",
                                                padding: "0px",
                                                textAlign: "left",
                                                borderRadius: "10px",
                                                maxWidth: '80%',
                                            }}
                                            model={{
                                                direction: getMessageDirection(message.senderId, currentUser!.id),
                                                message: message.content,
                                                position: 'first',
                                                type: 'html',
                                                sender: "Dong",
                                                sentTime: '15 mins ago'
                                            }}
                                            onClick={() => onShowMessageFooter(message.id!)}
                                        >
                                            {
                                                handleShowAvatar(timeDifference, sender, prevMessage!)
                                                // (message.senderId === currentUser?.id || sender?.id !== prevMessage?.senderId) ?
                                                //     null :
                                                //     < Avatar status={"invisible"} name={sender?.nickname}
                                                //              src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"/>

                                            }
                                            {
                                                (isLastMessageOutGoing(index === curConversation.messages.length - 1, getMessageDirection(message.senderId, currentUser!.id)))
                                                && <Message.Footer
                                                    style={{
                                                        left: '0px',
                                                        marginBottom: "0px",
                                                        marginTop: "0px",
                                                        paddingBottom: "0px",
                                                        paddingTop: "0px",
                                                    }}
                                                    sentTime={otherMembers?.every(member => member.notSeen) ? 'Đã gửi' : 'Đã xem'}/>
                                            }
                                            {
                                                (messageIdFooter === message.id) && <Message.Footer
                                                    style={{
                                                        left: '0px',
                                                        marginBottom: "0px",
                                                        marginTop: "0px",
                                                        paddingBottom: "0px",
                                                        paddingTop: "0px",
                                                    }}
                                                    sentTime={handleFormatSendTime(message.sendTime)}/>

                                            }
                                        </Message>
                                    </div>
                                )
                            })
                        )
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
                                  fancyScroll={true}
                                  autoFocus={true}
                                  sendButton={false}
                                  style={{
                                      width: "100%"
                                  }}
                                  onFocus={event => {
                                      console.log("onFocus input message")
                                      setIsOnFocus(true)
                                  }}
                                  onBlur={event => {
                                      console.log("onBlur input message")
                                      setIsOnFocus(false)
                                  }}
                                  onSend={sendMessage}/>
                    <CustomIcon iconName={"MinusIcon"}/>

                </div>
            </ChatContainer>
        </>
    )
}

export default memo(ChatBox)