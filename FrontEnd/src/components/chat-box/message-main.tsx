'use client'
import {
    Conversation, ConversationHeader,
    ConversationList, ExpansionPanel, InfoButton,
    MainContainer,
    Message, MessageInput,
    MessageList,
    MessageSeparator,
    Search,
    Sidebar, TypingIndicator, VideoCallButton, VoiceCallButton, Avatar, StatusList, Status
} from "@chatscope/chat-ui-kit-react";
import React, {useState} from "react";
import {RightSidebar} from "./right-sidebar";
import {LeftSidebar} from "./left-sidebar";
import ChatBox from "@components/chat-box/chat-box";

export function MessageMain() {
    const isLoading = false;
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);

    return (
        <MainContainer
            responsive
            className="min-h-screen"
        >
            {showLeftSidebar && <LeftSidebar/>}
            <ChatBox  />
            {showRightSidebar && <RightSidebar/>}
        </MainContainer>
    );
}