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
import {findFriend} from "../../services/main/clientRequest/friendsClient";
import {MyResponse} from "@models/responseObject";
import {SearchUserCard} from "@components/chat-box/chat-search-user";

interface ConversationsProps {
    closeConversations?: () => void; // The callback prop is an optional function
}

export function Conversations({closeConversations}: ConversationsProps) {
    const {state, dispatch, setReRender} = useChat()
    const {conversations, showChatBoxes, pickedConversations} = state
    const {stompClient} = useSocket()
    const {currentUser} = useUser()
    const [friends, setFriends] = useState<ConversationMember[]>([])
    const isInMessagePage = usePathname() === "/message"
    const [isSearching, setIsSearching] = useState(false)
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
        }
    })

    let timeoutId: string | number | NodeJS.Timeout | undefined;
    const onChangeSearch = async (search: string) => {
        const callback = async (search: string) => {
            if (search === "") {
                setFriends([])
                return;
            }
            const response: MyResponse<ConversationMember[]> = await findFriend(search)
            console.log("CALL API...", response.data)
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
            if(member.id === currentUser?.id)
                member.notSeen= false
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
                                const lastSendMember: ConversationMember | undefined = conversation.memberMap?.get(conversation?.lastMessage?.senderId)
                                const currentMember: ConversationMember | undefined = conversation.memberMap?.get(currentUser?.id!)
                                const otherMembers = conversation.members.filter(value => value.id !== currentUser?.id)
                                const isGroup: boolean = conversation.memberMap?.size !== 2
                                const content = conversation.lastMessage.content
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
                    friends &&
                    friends.map(value => {
                        return (
                            <SearchUserCard key={value.id} data={value}/>
                        )
                    })
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