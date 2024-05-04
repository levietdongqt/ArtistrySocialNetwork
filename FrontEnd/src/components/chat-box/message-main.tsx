'use client'
import {MainContainer} from "@chatscope/chat-ui-kit-react";
import React, {useEffect, useState} from "react";
import {RightSidebar} from "./right-sidebar";
import {Conversations} from "./conversations";
import dynamic from "next/dynamic";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import ChatBox from "@components/chat-box/chat-box";
import {useSearchParams} from "next/navigation";

export default function MessageMain() {
    const searchParams = useSearchParams()
    const {state: {pickedConversations, conversations}} = useChat()
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const [showChatBox, setShowChatBox] = useState(false);
    console.log("RE RENDER MESSAGE MAIN: ",searchParams.get("id"))
    return (
        <MainContainer
            responsive={false}
            // responsive={true}
            className="min-h-screen"
        >
            <Conversations callback={() => setShowChatBox(true)} />
            {showChatBox && <ChatBox curConversation={pickedConversations[0]}/>}
            {showRightSidebar && <RightSidebar/>}
        </MainContainer>
    );


}