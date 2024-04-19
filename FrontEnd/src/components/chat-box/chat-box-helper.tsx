'use client'
import {Avatar, MessageSeparator} from "@chatscope/chat-ui-kit-react";
import {MessageDto} from "@models/message";
import {ConversationDto, ConversationMember} from "@models/conversation";

interface MyAvatarProps {
    prevMessage: MessageDto | null,
    currentMessageSender: ConversationMember
}

interface MyMessageSeparatorProps {
    timeDifference: number | undefined,
    currentTime: Date
}

export function MyMessageSeparator({timeDifference, currentTime}: MyMessageSeparatorProps) {
    if (!timeDifference || timeDifference >= 60) {
        return (
            <MessageSeparator
                content={currentTime.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                })}/>
        )
    }
}

export function MyAvatar({prevMessage, currentMessageSender}: MyAvatarProps) {
    console.log("MyAvatar", prevMessage, currentMessageSender)
    if (!prevMessage || prevMessage.senderId !== currentMessageSender.id) {
        return <Avatar
            name={currentMessageSender?.nickname}
            src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
    }
}


export function getMessageDirection(senderId: String, currentId: String) {
    if (senderId === currentId)
        return "outgoing"
    return "incoming"
}

export function getReceiverIds(conversation: ConversationDto) {
    return conversation?.members.map(value => value.id);
}