'use client'
import {
    Avatar,
    Conversation,
    ConversationHeader,
    ConversationList,
    ExpansionPanel,
    Search,
    Sidebar
} from "@chatscope/chat-ui-kit-react";
import React, {useEffect, useState} from "react";
import {CustomIcon} from "@components/ui/custom-icon";
import useSWR from "swr";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {Loading} from "@components/ui/loading";
import {getConversationByUserId} from "../../services/realtime/clientRequest/conversationClient";
import {useUser} from "../../context/user-context";
import {ConversationDto} from "@models/conversation";
import {useChat} from "../../context/chat-context";
import {useSocket} from "../../context/websocket-context1";

interface LeftSidebarProps {
    closeLeftSideBar?: () => void; // The callback prop is an optional function
}

export function LeftSidebar({closeLeftSideBar}: LeftSidebarProps) {
    const {setCurConversation, setReRender, curConversation} = useChat()
    const [conversations, setConversations] = useState<ConversationDto[]>([])
    const {stompClient} = useSocket()
    const handleCloseLeftSideBar = () => {
        closeLeftSideBar?.();
    }
    const {currentUser} = useUser()
    const {
        isLoading,
    } = useSWR(currentUser && getConversationByUserId(currentUser.id), fetcherWithToken, {
        revalidateOnFocus: false,
        onSuccess: response => {
            setConversations(response.data)
            if (!curConversation) {
                setCurConversation(response.data?.[0])
            }
        }
    })

    const handlePickConversation = (conversation: ConversationDto) => {
        console.log("handlePickConversation")
        if (conversation.id !== curConversation?.id) {
            setCurConversation(conversation)
            setReRender(prev => prev + 1)
            const payload = {
                conversationId: conversation.id,
                senderId: currentUser!.id
            }
            stompClient?.send("/app/chat.getConversation", JSON.stringify(payload))
        }
    }

return (
    <>
        <Sidebar
            position="left"
        >
            <div className={'flex items-center'}>
                <Search placeholder="Search..."/>
                <button onClick={handleCloseLeftSideBar}>
                    <CustomIcon iconName={"CloseIcon"}/>
                </button>
            </div>
            {conversations &&
                <ConversationList loading={isLoading} key={"sdf"}>
                    {
                        conversations?.map((conversation: ConversationDto, index: number) => {
                            return (
                                <>
                                    <Conversation key={index}
                                                  info={conversation.lastMessage.content}
                                        // lastSenderName={conversation.members.filter((member: any) => member.id === conversation.lastMessage.senderId).at(0)!.nickname!
                                        // }
                                                  name={conversation.members.filter((member: any) => member.id === conversation.lastMessage.senderId).at(0)!.nickname!
                                                  }
                                                  onClick={() => handlePickConversation(conversation)}
                                    >
                                        <Avatar key={index}
                                                name="Lilly"
                                                src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"
                                                status="available"
                                        />
                                    </Conversation>
                                </>
                            )
                        })
                    }
                    {/*<Conversation*/}
                    {/*    info="Yes i can do it for you"*/}
                    {/*    lastSenderName="Lilly"*/}
                    {/*    name="Lilly"*/}
                    {/*>*/}
                    {/*    <Avatar*/}
                    {/*        name="Lilly"*/}
                    {/*        src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"*/}
                    {/*        status="available"*/}
                    {/*    />*/}
                    {/*</Conversation>*/}
                    {/*<Conversation*/}
                    {/*    info="Yes i can do it for you"*/}
                    {/*    lastSenderName="Patrik"*/}
                    {/*    name="Patrik"*/}
                    {/*>*/}
                    {/*    <Avatar*/}
                    {/*        name="Patrik"*/}
                    {/*        src="https://chatscope.io/storybook/react/assets/patrik-yC7svbAR.svg"*/}
                    {/*        status="invisible"*/}
                    {/*    />*/}
                    {/*</Conversation>*/}
                </ConversationList>
            }
        </Sidebar>
    </>

)
}