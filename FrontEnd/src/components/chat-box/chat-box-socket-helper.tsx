'use client'
import {ConversationDto} from "@models/conversation";
import {useSocket} from "../../context/websocket-context1";
import {useUser} from "../../context/user-context";
import {User} from "@models/user";
import {Client} from "@stomp/stompjs";
import {toast,Slide} from "react-toastify";
import {notification} from "antd";


export async function sendSeenFlag(conversation: ConversationDto, stompClient: Client, currentUser: User) {
    console.log("SEND SEEN FLAG", conversation)
    const payload = {
        id: conversation.id,
        members: conversation.members.filter(member => member.id !== currentUser?.id)
    }
    stompClient?.publish({
        destination: `/app/chat.seenFlag`,
        body: JSON.stringify(payload),
    })
}

export function checkNotSeen(conversation: ConversationDto, currentUser: User) {
    let isNotSeen = false
    conversation.members.forEach(member => {
        if (member.id === currentUser?.id && member.notSeen) {
            member.notSeen = false
            isNotSeen = true
        }
    })
    return isNotSeen;
}

export function toastMessage(message: string) {
    return toast(message,{
        position: "bottom-right",
        theme: "light",
        transition: Slide
    })
}



