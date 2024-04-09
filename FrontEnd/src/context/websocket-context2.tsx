"use client"
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import SockJS from 'sockjs-client';
import { over } from "stompjs";
import { getCookie } from "cookies-next";

type SocketContextType = {
  messages: any[];
  setMessages: (messages: any[]) => void;
};

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider = ({ children }: any) => {
  const [stompClient, setStompClient] = useState<any>();
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      console.log("Access token not found");
      return;
    }
  
    const socket = new SockJS('http://localhost:8060/api/realtime/ws');
    const client = over(socket);
  
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }

    client.connect(headers, () => {
      console.log('Connected');
  
  
      setStompClient(client);
      
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
      value={{ messages,setMessages}}
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