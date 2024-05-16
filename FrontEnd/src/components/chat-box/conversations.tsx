'use client'
import {Avatar, AvatarGroup, Conversation, ConversationList, Search, Sidebar} from "@chatscope/chat-ui-kit-react";
import React, {useEffect, useState} from "react";
import {CustomIcon} from "@components/ui/custom-icon";
import useSWR from "swr";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {getConversationByUserId} from "../../services/realtime/clientRequest/conversationClient";
import {useUser} from "../../context/user-context";
import {ConversationDto, ConversationMember} from "@models/conversation";
import {useChat} from "../../context/chat-context";
import {useSocket} from "../../context/websocket-context1";
import {ACTION_TYPE, ChatAction, initMemberMapOfConversation} from "@lib/reducer/chat-reducer";
import {handlePickedConversations} from "@components/chat-box/chat-box-helper";
import {usePathname, useSearchParams} from 'next/navigation'
import {findFriend} from "../../services/main/clientRequest/friendsClient";
import {MyResponse} from "@models/responseObject";
import {SearchUserCard} from "@components/chat-box/chat-search-user";
import {handleFormatDurationSendTime} from "@lib/helper/dateParse";
import {checkNotSeen, sendSeenFlag} from "@components/chat-box/chat-box-socket-helper";
import {
    findConversationByFriendName,
    findConversationById
} from "../../services/realtime/clientRequest/conversationClient";
import {Modal} from "../../app/(users)/_components/modal/modal";
import MyAvatarGroup from "@components/chat-box/AvatarGroup";

interface ConversationsProps {
    closeConversations?: () => void; // The callback prop is an optional function
    callback?: () => void; // The callback prop is an optional function
}

export function Conversations({closeConversations, callback}: ConversationsProps) {
    const [searchString, setSearchString] = useState('')
    const {stompClient} = useSocket()
    const {state, dispatch, setReRender} = useChat()
    const {conversations, showChatBoxes, pickedConversations} = state

    const {currentUser} = useUser()
    const [friends, setFriends] = useState<ConversationDto[]>([])
    const isInMessagePage = usePathname() === "/message"
    const [isSearching, setIsSearching] = useState(false)
    const searchPramId = useSearchParams().get('id')
    useEffect(() => {
        // console.log("CONVERSATION MOUNT")
        // if (isInMessagePage) {
        //     dispatch(ChatAction(false, ACTION_TYPE.SHOW_CHAT_ALERT))
        // }
        // return () => {
        //     if (isInMessagePage) {
        //         dispatch(ChatAction(true, ACTION_TYPE.SHOW_CHAT_ALERT))
        //     }
        // }
    }, []);

    const {isLoading} = useSWR(currentUser && getConversationByUserId(), fetcherWithToken, {
        revalidateOnFocus: false,
        refreshInterval: 0,
        onSuccess: async response => {
            console.log("GET CONVERSATIONS: ", response)
            if(!response.data || response.data.length === 0){
                return;
            }
            dispatch(ChatAction(response.data, ACTION_TYPE.SET_CONVERSATIONS))
            if (!isInMessagePage) {
                return
            }

            let newPickedCon = [response.data?.[0], undefined, undefined]
            if (searchPramId) {
                const response1 = await findConversationById(searchPramId)
                console.log("searchPramId: ", response1)
                if (response1.status === 200) {
                    newPickedCon[0] = response1.data as ConversationDto
                    initMemberMapOfConversation(newPickedCon[0])
                }
            }
            dispatch(ChatAction(newPickedCon, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
            callback?.();
        }
    })

    let timeoutId: string | number | NodeJS.Timeout | undefined;
    const onChangeSearch = async (search: string) => {
        const callback = async (search: string) => {
            if (search === "") {
                setFriends([])
                return;
            }
            const response: MyResponse<ConversationDto[]> = await findConversationByFriendName(search)
            setFriends(response.data)
            setSearchString(search);
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
        console.group("onPickConversation")
        const isNotSeen = checkNotSeen(curConversation, currentUser!)
        if (isNotSeen) {
            sendSeenFlag(curConversation, stompClient!, currentUser!)
            dispatch(ChatAction(curConversation, ACTION_TYPE.UPDATE_CONVERSATION))
        }

        const curIndex = pickedConversations.findIndex(value => value?.id === curConversation.id);
        //Conversation was picked and is showing
        if (curIndex !== -1 && (showChatBoxes[curIndex] || isInMessagePage)) {
            console.log("Conversation is existing")
            return
        }
        if (isInMessagePage) {
            console.log("Is in message page")
            let newPickedCon = [...pickedConversations]
            newPickedCon[0] = curConversation
            dispatch(ChatAction(newPickedCon, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
            return;
        }
        //Conversation was picked and not showing
        let newShowChatBoxes = [...showChatBoxes]
        if (curIndex !== -1 && !showChatBoxes[curIndex]) {
            console.log("Conversation was picked and not showing")
            newShowChatBoxes[curIndex] = true
        } else {
            console.log("Conversation not picked and not showing")
            const newPickedCon = handlePickedConversations(curConversation, pickedConversations)
            dispatch(ChatAction(newPickedCon, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
            newShowChatBoxes = [true, ...newShowChatBoxes].slice(0, 3)
        }
        !isInMessagePage && dispatch(ChatAction(newShowChatBoxes, ACTION_TYPE.SHOW_CHAT_BOXES))

        console.groupEnd();
    }

    return (
        <>
            <Sidebar className={isInMessagePage ? "" :
                "rounded-2xl border-2 "}
                     style={isInMessagePage ? {height: '100vh'} : {
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

                                const currentMember: ConversationMember | undefined = conversation.memberMap?.get(currentUser?.id!)
                                const otherMembers = conversation.members.filter(value => value.id !== currentUser?.id && !value.isExited)
                                const isGroup: boolean = conversation.type === "GROUP"

                                if (!conversation.lastMessage) {
                                    return (
                                        <Conversation
                                            key={conversation.id}
                                            name={conversation.name || otherMembers[0].nickname}
                                            onClick={() => onPickConversation(conversation)}
                                            info={'Hãy bắt đầu trò chuyện nào!'}
                                            className={'mx-2 my-0.5 rounded-md'}
                                            style={{
                                                paddingTop: '4px'
                                            }}
                                        >
                                            <div is={"AvatarGroup"} className={"mr-3"}>
                                                <MyAvatarGroup members={otherMembers}/>
                                            </div>
                                        </Conversation>
                                    )
                                }

                                const lastSendMember: ConversationMember | undefined = conversation.memberMap?.get(conversation?.lastMessage?.senderId)
                                const content = conversation.lastMessage?.content
                                const lastActivityTime = new Date(Date.now()).getTime() - new Date(conversation.lastMessage?.sendTime).getTime()
                                return (
                                    <>
                                        <Conversation key={conversation.id}
                                                      active={currentMember?.notSeen}
                                                      unreadDot={currentMember?.notSeen}
                                                      info={content.length < 30 ? content : content.substring(0, 30).concat(" ...")}
                                                      lastSenderName={(lastSendMember?.id === currentUser?.id) ? "Bạn" : lastSendMember?.nickname}
                                                      name={conversation.name || otherMembers[0].nickname}
                                                      onClick={() => onPickConversation(conversation)}
                                                      className={'mx-2 my-0.5 rounded-md'}
                                                      lastActivityTime={<span style={{
                                                          color: "teal"
                                                      }}>{lastActivityTime < 60000 ? 'Hiện tại' : handleFormatDurationSendTime(lastActivityTime)}</span>}
                                        >

                                            <div is={"AvatarGroup"} className={"mr-3"}>
                                                <MyAvatarGroup members={otherMembers}/>
                                            </div>

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
                            {searchString.length > 0 && <div className={"text-center mt-5"}>Không tìm thấy bạn bè</div>}
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