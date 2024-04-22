"use client"
import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import SockJS from 'sockjs-client';
import {useChat} from "./chat-context";
import {dateParse} from "@lib/helper/dateParse";
import {Client, over} from 'webstomp-client';
import {useNotification} from "./notification-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import {ConversationDto} from "@models/conversation";

type SocketContextType = {
    stompClient: Client | null;
    setStompClient: (stompClient: Client | null) => void;
};

export const SocketContext = createContext<SocketContextType | undefined>(
    undefined
);

export const SocketProvider = ({children}: any) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const {dataCount, setDataCount, setNotificationsContent} = useNotification();
    const socketRef = useRef<Client | null>(null);
    const {state, dispatch} = useChat()
    // const { curConversation}  = state
    useEffect(() => {
        if (socketRef.current !== null) {
            return;
        }
        const socket = new SockJS('http://localhost:8062/api/realtime/socket.io');
        const client = over(socket);
        socketRef.current = client;
        client.connect({}, () => {
            console.log('Connected');
            client.subscribe(`/user/chat/message`, (message) => {
                const conversation: ConversationDto = JSON.parse(message.body, dateParse);
                console.log("Got new message: ", conversation.lastMessage.sendTime instanceof Date)
                dispatch(ChatAction(conversation.lastMessage, ACTION_TYPE.UPDATE_MESSAGE))
                dispatch(ChatAction(conversation,ACTION_TYPE.UPDATE_CONVERSATIONS))
            });
            client.subscribe(`/user/topic/private-notification`, (message) => {
                if (message.body) {
                    const newMessage = JSON.parse(message.body);
                    setNotificationsContent(newMessage);
                    setDataCount((prevDataCount: number) => prevDataCount + 1);
                }
            });

            setStompClient(client);
        }, error => {
            console.log(error);
        });

        return () => {
            if (client && client.connected) {
                client.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, []);

    return (
        <SocketContext.Provider
            value={{stompClient, setStompClient}}
        >
            {children}
        </SocketContext.Provider>

    );
};

export function useSocket(): SocketContextType {
    const context = useContext(SocketContext);
    if (!context)
        throw new Error("useSocket must be used within a SocketContextProvider");
    return context;
}