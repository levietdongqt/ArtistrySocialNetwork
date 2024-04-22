'use client'
import {MainContainer} from "@chatscope/chat-ui-kit-react";
import React, {useState} from "react";
import {RightSidebar} from "./right-sidebar";
import {Conversations} from "./conversations";
import {ConversationDto} from "../../models/conversation";
import dynamic from "next/dynamic";
import useSWR from "swr";
import {getConversationByUserId} from "../../services/realtime/clientRequest/conversationClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {Loading} from "@components/ui/loading";
import {useUser} from "../../context/user-context";
import {useChat} from "../../context/chat-context";

export default function MessageMain() {
    const ChatBox = dynamic(() =>
            import ("@components/chat-box/chat-box"), {
            ssr: false
        }
    )
    const {state: {pickedConversations}} = useChat()
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const [showConversations, setShowConversations] = useState(true);
    return (
        <MainContainer
            responsive={false}
            // responsive={true}
            className="min-h-screen"
        >
            {showConversations && <Conversations/>}
            <ChatBox curConversation={undefined}/>
            {showRightSidebar && <RightSidebar/>}
        </MainContainer>
    );


}