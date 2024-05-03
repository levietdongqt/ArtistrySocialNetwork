'use client'
import {Avatar, MessageSeparator} from "@chatscope/chat-ui-kit-react";
import {MessageDto} from "@models/message";
import {ConversationDto, ConversationMember} from "@models/conversation";

const milliPerDay = 86400000;

interface MyAvatarProps {
    prevMessage: MessageDto | null,
    currentMessageSender: ConversationMember
}

interface MyMessageSeparatorProps {
    timeDifference: number | undefined,
    currentTime: Date
}

export function MyMessageSeparator({timeDifference, currentTime}: MyMessageSeparatorProps) {
    const dayBeforeNow = (new Date(Date.now()).getTime() - currentTime.getTime()) / milliPerDay;
    if (!timeDifference || timeDifference >= 60) {
        if (dayBeforeNow < 7) {
            return (
                <MessageSeparator style={{
                    fontSize: "12px"
                }}
                                  content={currentTime.toLocaleDateString('vi-VN', {
                                      weekday: 'narrow',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                  })}/>
            )
        }
        return (
            <MessageSeparator className={"text-xs"}
                              content={currentTime.toLocaleDateString('vi-VN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
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

// @ts-ignore
export function handlePickedConversations(conversation: ConversationDto, pickedConversations: (ConversationDto | undefined)[]) {
    let newPickedCon = [...pickedConversations]
    // const firstUndefinedIndex = pickedConversations.findIndex(item => !item);
    // if (firstUndefinedIndex !== -1) {
    //     newPickedCon[firstUndefinedIndex] = conversation;
    //     return newPickedCon;
    // }
    // const lastPickedIndex = pickedConversations.length - 1;
    // newPickedCon[lastPickedIndex] = conversation;
    // return newPickedCon;
    return [conversation, ...newPickedCon].slice(0, 3)
}

export function handleFormatSendTime(sendTime: Date) {
    let formatTime: string;
    if (sendTime.getMinutes() < 10) {
        formatTime = `${sendTime.getHours()}:0${sendTime.getMinutes()}`
    } else {
        formatTime = `${sendTime.getHours()}:${sendTime.getMinutes()}`
    }
    return formatTime;
}

export function isLastMessageOutGoing(isLastMessage: boolean, direction: string): boolean {
    return isLastMessage && direction === "outgoing";
}

export function chatBoxNavBars() {

}

