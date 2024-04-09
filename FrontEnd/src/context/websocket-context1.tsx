"use client"
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import SockJS from 'sockjs-client';
import { Client,over  } from 'webstomp-client';
import { getCookie } from "cookies-next";

type SocketContextType = {
  stompClient: Client | null;
  setStompClient: (stompClient: Client | null) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
};

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider = ({ children }: any) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      console.log("Access token not found");
      return;
    }
  
    const socket = new SockJS('http://localhost:8062/api/realtime/socket.io');
    const client = over(socket);
  
    client.connect({ Authorization: `Bearer ${accessToken}`}, () => {
      console.log('Connected');
  
      client.subscribe('/topic/messages', (message) => {
        if (message.body) {
          const newMessage = JSON.parse(message.body);
          setMessages((previousMessages) => [...previousMessages, newMessage]);
        }
      });
  
      setStompClient(client);
      
    }, error => {
      console.log(error);
    });
  
    return () => {
      // if (client) {
      //   client.disconnect(() => {
      //     console.log('Disconnected');
      //   });
      // }
    };
  
  }, []);
  
  return (
    <SocketContext.Provider
      value={{ stompClient, setStompClient, messages, setMessages }}
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