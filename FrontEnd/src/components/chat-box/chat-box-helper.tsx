'use client'
import {Avatar, MessageSeparator} from "@chatscope/chat-ui-kit-react";
import {MessageDto} from "@models/message";
import {ConversationDto, ConversationMember} from "@models/conversation";
import {ACTION_TYPE, ChatAction, initMemberMapOfConversation, stateType} from "@lib/reducer/chat-reducer";
import {checkConversation} from "../../services/realtime/clientRequest/conversationClient";
import {User} from "@models/user";
import {toast} from "react-toastify";

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

export async function openConversationWithAnyone(currentUser: User, friend: any, state: stateType, dispatch: React.Dispatch<any>) {
    const requestBody = JSON.stringify({
        createAt: new Date(Date.now() + 1000 * 60 * 60 * 7),
        type: "PRIVATE",
        members: [
            {
                id: currentUser.id,
                fullName: currentUser.fullName,
                nickname: currentUser.fullName,
                avatar: currentUser.avatar,
                notSeen: false,
            }, {
                id: friend.id,
                fullName: friend.fullName,
                nickname: friend.fullName,
                avatar: friend.avatar,
                notSeen: false,
            }
        ]
    })
    const response = await checkConversation(requestBody)
    console.log("openConversationWithAnyone", response)
    if (response.status === 200) {
        let conversation = response.data as ConversationDto
        const curIndex = state.pickedConversations.findIndex(value => value?.id === conversation.id);
        //Conversation was picked and is showing
        if (curIndex !== -1 && (state.showChatBoxes[curIndex])) {
            console.log("Conversation is existing")
            return
        }
        let newShowChatBoxes = [...state.showChatBoxes]
        if (curIndex !== -1 && !state.showChatBoxes[curIndex]) {
            console.log("Conversation was picked and not showing")
            newShowChatBoxes[curIndex] = true
        } else {
            console.log("Conversation not picked and not showing")
            conversation = initMemberMapOfConversation(conversation)
            console.log("Conversation: ", conversation)
            const newPickedCon = handlePickedConversations(conversation, state.pickedConversations)
            dispatch(ChatAction(newPickedCon, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
            newShowChatBoxes = [true, ...newShowChatBoxes].slice(0, 3)
        }
        dispatch(ChatAction(newShowChatBoxes, ACTION_TYPE.SHOW_CHAT_BOXES))
    } else {
        console.log(response)
        toast.error("Có lỗi xảy ra, vui lòng thử lại!")
    }

}

