'use client'
import {
    Avatar,
    ConversationHeader,
    InfoButton, Message, MessageInput,
    MessageList, MessageSeparator, TypingIndicator,
    VideoCallButton,
    VoiceCallButton, ChatContainer
} from "@chatscope/chat-ui-kit-react";
import React from "react";

interface ChatBoxProps {
    closeChatBox?: () => void; // The callback prop is an optional function
}

export default function ChatBox({closeChatBox}: ChatBoxProps) {
    const handleCloseChatBox = () => {
        closeChatBox?.();
    }
    return (
        <>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Back onClick={handleCloseChatBox}/>
                    <Avatar
                        name="Zoe"
                        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                    />
                    <ConversationHeader.Content
                        title={"HELLO"}
                        info="Active 10 mins ago"
                        userName="Zoe"
                    />
                    <ConversationHeader.Actions>
                        <VoiceCallButton/>
                        <VideoCallButton/>
                        <InfoButton/>
                    </ConversationHeader.Actions>
                </ConversationHeader>
                <MessageList

                    loading={false}
                    typingIndicator={<TypingIndicator content="Zoe is typing"/>}

                >
                    <MessageList.Content
                        className="flex flex-col justify-end items-center h-full pb-10 text-center text-lg"
                    >
                        <MessageSeparator content="Saturday, 30 November 2019"/>
                        <Message
                            model={{
                                direction: 'incoming',
                                message: 'Hello my friend',
                                position: 'single',
                                sender: 'Zoe',
                                sentTime: '15 mins ago'
                            }}
                        >
                            <Avatar
                                name="Zoe"
                                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                            />
                        </Message>
                        <Message
                            model={{
                                direction: 'outgoing',
                                message: 'Hello my friend',
                                position: 'single',
                                sender: 'Zoe',
                                sentTime: '15 mins ago'
                            }}
                        >
                            <Avatar
                                name="Zoe"
                                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                            />
                        </Message>
                        <Message
                            avatarSpacer
                            model={{
                                direction: 'outgoing',
                                message: 'Hello my friend',
                                position: 'single',
                                sender: 'Patrik',
                                sentTime: '15 mins ago',
                            }}
                        />
                        <Message
                            avatarSpacer
                            model={{
                                direction: 'incoming',
                                message: 'Hello my friend',
                                position: 'single',
                                sender: 'Patrik',
                                sentTime: '15 mins ago',
                            }}
                        />
                    </MessageList.Content>

                </MessageList>
                <MessageInput placeholder="Type message here"/>
            </ChatContainer>
        </>
    )
}