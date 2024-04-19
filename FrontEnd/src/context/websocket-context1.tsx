"use client"
import React, {createContext, useContext, useEffect, useState, useRef} from "react";
import SockJS from 'sockjs-client';
import {Client, ConnectionHeaders, over} from 'webstomp-client';
import {getCookie} from "cookies-next";
import {useUser} from "./user-context";
import {User} from "@models/user";
import {useChat} from "./chat-context";
import {MessageDto} from "@models/message";
import {dateParse} from "@lib/helper/dateParse";

type SocketContextType = {
    stompClient: Client | null;
    setStompClient: (stompClient: Client | null) => void;
    notificationMessages: any;
    setNotificationMessages: (messages: any) => void;
};

export const SocketContext = createContext<SocketContextType | undefined>(
    undefined
);

export default function SocketProvider({children}: any) {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [notificationMessages, setNotificationMessages] = useState<any>(null);
    const {currentUser} = useUser()
    const {updateMessage, setReRender, curConversation} = useChat()
    const socketRef = useRef(null);
    useEffect(() => {
        if (socketRef.current !== null) {
            // Không tạo một kết nối WebSocket mới nếu đã có một kết nối tồn tại.
            return;
        }
        const socket = new SockJS('http://localhost:8062/api/realtime/socket.io');
        const client = over(socket);
        // @ts-ignore
        socketRef.current = client;
        const headers: ConnectionHeaders = {
            passcode: currentUser?.id,
            "Content-Type": "application/json",
            "access-token": getCookie("access_token")?.toString()
        }
        client.connect(headers, () => {
            console.log('Connected to server');
            const user: User = getCookie("user")?.toString() ? JSON.parse(getCookie("user")?.toString()!) : null;
            client.subscribe(`/user/chat/message`, (message) => {
                console.log("Message json:", message.body)
                const newMessage: MessageDto = JSON.parse(message.body,dateParse);
                console.log("newMessage: ",newMessage.conversationId, " -> ","current: ",curConversation?.id)
                if (true ){
                    updateMessage(newMessage)
                }
                setReRender(prev => prev + 1)
            });

            client.subscribe(`/user/topic/private-notification`, (message) => {
                if (message.body) {
                    const newMessage = JSON.parse(message.body);
                    setNotificationMessages(newMessage);
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
            value={{stompClient, setStompClient, notificationMessages, setNotificationMessages}}
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