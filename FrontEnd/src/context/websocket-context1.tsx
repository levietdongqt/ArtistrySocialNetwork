"use client"
import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {useChat} from "./chat-context";
import {dateParse} from "@lib/helper/dateParse";
import {useNotification} from "./notification-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import {ConversationDto} from "@models/conversation";
import {Client} from "@stomp/stompjs";
import {getCookie} from "cookies-next";
import {toast} from "react-toastify";
import {ResponseSocket} from "@models/ResponseSocket";
import {ResponseSocketType} from "@lib/enum/MessageType";

type SocketContextType = {
    stompClient: Client | null;
    setStompClient: (stompClient: Client | null) => void;
};

export const SocketContext = createContext<SocketContextType | undefined>(
    undefined
);

export const SocketProvider = ({children}: any) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const {setDataCount, setNotificationsContent} = useNotification();
    const socketRef = useRef<Client | null>(null);
    const {dispatch} = useChat()
    // const { curConversation}  = state
    useEffect(() => {
        if (socketRef.current !== null) {
            return;
        }
        const access_token = getCookie("access_token")?.toString()
        if (!access_token) {
            toast.error("Có lỗi xảy ra, vui lòng tải lại trang!")
        }
        const client = new Client({
            connectHeaders: {
                access_token: access_token!,
            },
            brokerURL: 'ws://localhost:8060/api/realtime/socket.io',
            onConnect: () => {
                console.log('connected');
                client.subscribe(`/user/chat/message`, (message) => {
                    const conversation: ConversationDto = JSON.parse(message.body, dateParse);
                    dispatch(ChatAction(conversation.lastMessage, ACTION_TYPE.UPDATE_MESSAGE))
                    dispatch(ChatAction(conversation, ACTION_TYPE.UPDATE_CONVERSATIONS))
                });

                client?.subscribe(`/user/chat/conversation`, (message) => {
                    const response: ResponseSocket = JSON.parse(message.body, dateParse)
                    switch (response.type) {
                        case ResponseSocketType.GET_CONVERSATION:
                            response.data && dispatch(ChatAction(response.data, ACTION_TYPE.SET_NEW_MESSAGES))
                            break;
                    }

                });


                client.subscribe(`/user/topic/private-notification`, (message) => {
                    if (message.body) {
                        const newMessage = JSON.parse(message.body);
                        setNotificationsContent(newMessage);
                        setDataCount((prevDataCount: number) => prevDataCount + 1);
                    }
                });
                setStompClient(client);
            },

            onWebSocketError(error: Error): void {
                console.log(error);
            }
        });
        socketRef.current = client;
        client.activate();
        return () => {
            if (client && client.connected) {
                client.deactivate().then(() => console.log('Disconnected'))
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