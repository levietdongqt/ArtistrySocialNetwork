'use client'
import {MainContainer} from "@chatscope/chat-ui-kit-react";
import React, {useState} from "react";
import {RightSidebar} from "./right-sidebar";
import {LeftSidebar} from "./left-sidebar";
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
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    return (
        <MainContainer
            // responsive={true}
            className="min-h-screen"
        >
            {showLeftSidebar && <LeftSidebar/>}
            <ChatBox/>
            {showRightSidebar && <RightSidebar/>}
        </MainContainer>
    );


}