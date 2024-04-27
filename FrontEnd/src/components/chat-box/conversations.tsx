'use client'
import {Avatar, Conversation, ConversationList, Search, Sidebar} from "@chatscope/chat-ui-kit-react";
import React, {useEffect, useState} from "react";
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
import {findFriend} from "../../services/main/clientRequest/friendsClient";
import {MyResponse} from "@models/responseObject";
import {SearchUserCard} from "@components/chat-box/chat-search-user";
import {formatDurationConversation} from "@lib/helper/dateParse";

interface ConversationsProps {
    closeConversations?: () => void; // The callback prop is an optional function
}

export function Conversations({closeConversations}: ConversationsProps) {
    const {state, dispatch, setReRender} = useChat()
    const {conversations, showChatBoxes, pickedConversations} = state
    const {stompClient} = useSocket()
    const {currentUser} = useUser()
    const [friends, setFriends] = useState<ConversationDto[]>([])
    const isInMessagePage = usePathname() === "/message"
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        console.log("CONVERSATION MOUNT")
        if (isInMessagePage) {
            dispatch(ChatAction(false, ACTION_TYPE.SHOW_CHAT_ALERT))
        }
        return () => {
            if (isInMessagePage) {
                dispatch(ChatAction(true, ACTION_TYPE.SHOW_CHAT_ALERT))
            }
        }
    }, []);
    const {
        isLoading,
    } = useSWR(currentUser && getConversationByUserId(currentUser.id), fetcherWithToken, {
        revalidateOnFocus: false,
        refreshInterval: 0,
        onSuccess: response => {
            dispatch(ChatAction(response.data, ACTION_TYPE.SET_CONVERSATIONS))
        }
    })

    let timeoutId: string | number | NodeJS.Timeout | undefined;
    const onChangeSearch = async (search: string) => {
        const callback = async (search: string) => {
            if (search === "") {
                setFriends([])
                return;
            }
            const response: MyResponse<ConversationDto[]> = await findFriend(search)
            console.log("FRIENDS: ", response.data)
            setFriends(response.data)
        }
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            callback(search)
        }, 500)
        //
        // console.log("onsubmitSearch", search)
        // const response = await findFriend("Le")
        // console.log("GET FRIEND: ", response)
    }

    const onClearSearch = () => {
        setFriends([])
    }
    const onPickConversation = (curConversation: ConversationDto) => {
        console.log("onPickConversation", pickedConversations, curConversation)
        const newShowChatBoxes = [...showChatBoxes]
        const curIndex = pickedConversations.findIndex(value => value?.id === curConversation.id);
        //Conversation was picked and is showing
        if (curIndex !== -1 && showChatBoxes[curIndex]) {
            console.log("Conversation is existing")
            return
        }
        curConversation.members.forEach(member => {
            if (member.id === currentUser?.id)
                member.notSeen = false
        })   // must send new update to server
        //Conversation was picked and not showing
        if (curIndex !== -1 && !showChatBoxes[curIndex]) {
            newShowChatBoxes[curIndex] = true
        } else {
            const newPickedCon = handlePickedConversations(curConversation, pickedConversations)
            dispatch(ChatAction(newPickedCon, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
            const newIndex = newPickedCon.findIndex(value => value?.id === curConversation.id)
            newShowChatBoxes[newIndex] = true
        }
        !isInMessagePage && dispatch(ChatAction(newShowChatBoxes, ACTION_TYPE.SHOW_CHAT_BOXES))
        setReRender(prev => prev + 1)

    }

    return (
        <>
            <Sidebar className={isInMessagePage ? "" :
                "rounded-2xl border-2 "}
                     style={isInMessagePage ? {} : {
                         height: '60vh',
                         width: '20vw',
                         overflow: 'hidden'
                     }}
                     position="left"
                     scrollable={true}
            >
                <div className={` ${isSearching && 'flex items-center ml-2'}   p-2 `}>
                    {
                        isSearching &&
                        <button className={"relative overflow-hidden pr-1"}
                                onFocus={() => setIsSearching(false)}>
                             <span
                                 className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                                </span>
                            <CustomIcon iconName={"ArrowLeft"}/>
                        </button>
                    }

                    <Search placeholder="Tìm kiếm bạn bè..."
                            onFocus={() => setIsSearching(true)}
                            onChange={onChangeSearch}
                            onClearClick={onClearSearch}
                            style={isInMessagePage ? {} : {}}
                    />
                </div>
                {(!isSearching && conversations) ?
                    <ConversationList loading={isLoading} key={"sdf"}>
                        {
                            conversations?.map((conversation: ConversationDto, index: number) => {
                                if (!conversation.lastMessage) {
                                    return
                                }
                                const lastSendMember: ConversationMember | undefined = conversation.memberMap?.get(conversation?.lastMessage?.senderId)
                                const currentMember: ConversationMember | undefined = conversation.memberMap?.get(currentUser?.id!)
                                const otherMembers = conversation.members.filter(value => value.id !== currentUser?.id)
                                const isGroup: boolean = conversation.memberMap?.size !== 2
                                const content = conversation.lastMessage?.content
                                const lastActivityTime = new Date(Date.now()).getTime() - new Date(conversation.lastMessage?.sendTime).getTime()
                                return (
                                    <>
                                        <Conversation key={conversation.id}
                                                      active={currentMember?.notSeen}
                                                      unreadDot={currentMember?.notSeen}
                                                      info={content.length < 20 ? content : content.substring(0, 30).concat(" ...")}
                                                      lastSenderName={(lastSendMember?.id === currentUser?.id) ? "Bạn" : lastSendMember?.nickname}
                                                      name={!isGroup ? otherMembers[0].nickname : "Group chat"}
                                                      onClick={() => onPickConversation(conversation)}
                                                      className={'mx-2 my-0.5 rounded-md'}
                                                      lastActivityTime={<span style={{
                                                          color: "teal"
                                                      }}>{lastActivityTime < 60000 ? 'Hiện tại' : formatDurationConversation(lastActivityTime)}</span>}
                                        >
                                            {
                                                !isGroup &&
                                                <Avatar key={index}
                                                        title={otherMembers[0].fullName ? otherMembers[0].fullName : ""}
                                                        name={otherMembers[0].nickname}
                                                        src={otherMembers[0].avatar || "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"}
                                                        status="available"
                                                />
                                            }
                                        </Conversation>
                                    </>
                                )
                            })
                        }
                    </ConversationList>
                    :
                    friends.length !== 0 ?
                        friends.map(value => {
                            return (
                                <SearchUserCard key={value.id} conversation={value}
                                                onPickConversation={onPickConversation}/>
                            )
                        })
                        :
                        <>
                            <div>Không tìm thấy bạn bè</div>
                        </>
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