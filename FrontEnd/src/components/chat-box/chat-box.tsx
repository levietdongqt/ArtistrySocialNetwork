'use client'
import {
    Avatar,
    AvatarGroup,
    ChatContainer,
    ConversationHeader,
    Message,
    MessageInput,
    MessageList,
    TypingIndicator,
    InfoButton
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
import {Tooltip} from "antd";
import MiniChatBox from "@components/chat-box/mini-chat-box";

interface ChatBoxProps {
    isMinusChatBox?: boolean; // The callback prop is an optional function
    curConversation: ConversationDto | undefined
}

export default function ChatBox({isMinusChatBox, curConversation}: ChatBoxProps) {
    const {currentUser} = useUser();
    const [memberMap, setMemberMap] = useState(new Map<string, ConversationMember>())
    const {state, dispatch, reRender} = useChat()
    const {pickedConversations, showChatBoxes} = state!;
    const {stompClient} = useSocket();
    const [messageIdFooter, setMessageIdFooter] = useState("")
    const otherMembers = curConversation?.members?.filter(memberMap => memberMap.id !== currentUser?.id);
    useEffect(() => {
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
        const members = curConversation?.members.map(member => {
            if (member.id !== currentUser!.id) {
                member.notSeen = true
            } else {
                member.notSeen = false
            }
            return member
        })
        const payload = {
            members: members,
            name: curConversation?.name,
            id: curConversation?.id!,
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
        const newShowChatBoxes = [...showChatBoxes]
        const currIndex = pickedConversations.findIndex(value => value?.id === curConversation?.id);
        newShowChatBoxes[currIndex] = toggle
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

    if (isMinusChatBox) {
        return <MiniChatBox curConversation={curConversation}
                            onClickCloseMessage={onClickCloseMessage}
                            onClickMinusChatBox={onClickMinusChatBox}
        />
    }
    return (
        <>
            <ChatContainer className={"border-2 overflow-auto  "}
                           style={{
                               fontSize: "16px",
                               borderTopLeftRadius: "20px",
                               borderTopRightRadius: "20px",
                               borderBottomLeftRadius: "10px",
                               borderBottomRightRadius: "10px",
                               boxShadow: "5px",
                               width: "20vw",
                               height: "60vh"
                           }}>

                <ConversationHeader>
                    {
                        otherMembers?.length === 1 ?
                            <Avatar
                                name={otherMembers[0].nickname}
                                src={otherMembers[0].avatar}
                            />
                            :
                            <AvatarGroup size={"md"} hoverToFront={true} style={{
                                display: 'flex', flexDirection: 'row'
                            }}>
                                <div is={"Avatar"}>
                                    <Avatar
                                        name={"Nhóm"}
                                        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                                    />
                                </div>
                                <div is={"Avatar"}>
                                    <Avatar
                                        name={"Nhóm"}
                                        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                                    />
                                </div>
                            </AvatarGroup>
                    }
                    <ConversationHeader.Content
                        title={"HELLO"}
                        info="Active 10 mins ago"
                        userName={curConversation?.members?.filter(memberMap => memberMap.id !== currentUser?.id).pop()?.nickname}
                    />
                    <ConversationHeader.Actions>
                        <MyTooltip content={"Thêm"}>
                            <button className="relative overflow-hidden">
                            <span
                                className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                            </span>
                                <InfoButton/>
                            </button>
                        </MyTooltip>
                        <MyTooltip content={"Thu nhỏ"}>
                            <button className="relative overflow-hidden"
                                    onClick={() => onClickMinusChatBox(false)}
                            >
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
                                const sender: ConversationMember = curConversation.memberMap?.get(message.senderId)!
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
                                                type: message.type,
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
                                                (messageIdFooter === message.id) && <Message.Footer
                                                    style={{
                                                        left: '0px',
                                                        marginBottom: "0px",
                                                        marginTop: "0px",
                                                        paddingBottom: "0px",
                                                        paddingTop: "0px",
                                                    }}
                                                    sentTime={`${message.sendTime.getHours()}:${message.sendTime.getMinutes()}`}/>

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
                                  autoFocus = {true}
                                  sendButton={false}
                                  style={{
                                      width: "100%"
                                  }}
                                  onSend={sendMessage}/>
                    <CustomIcon iconName={"MinusIcon"}/>

                </div>
            </ChatContainer>
        </>
    )
}