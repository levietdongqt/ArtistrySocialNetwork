"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { getCookie } from 'cookies-next';

type WBContextType = {
  client: Client | null;
  setClient: (client: Client | null) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
};

export const WebSocketContext = createContext<WBContextType | undefined>(undefined);

export const WebSocketProvider = ({children}: any) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  console.log("config websocket context lan 1")
  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8060/api/realtime/ws',
      reconnectDelay: 1000,
      connectHeaders: {
        'Authorization': `Bearer ${getCookie('access_token')?.toString()}`
      },
      debug: function (str) {
        console.log(str);

      },
    });
    console.log("config websocket context lan 3")
    client.onConnect = function (frame) {
      console.log("onConnect","true")
      setIsConnected(true);
    };

    client.onDisconnect = function (frame) {
      console.log("onConnect","false")
      setIsConnected(false);
    };

    client.onStompError = function (frame) {
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };
    

    client.activate();

    setClient(client);
    console.log(client);
    console.log(isConnected)

    return () => {
      if(client) {
        client.deactivate();
      }
    }
  }, []);
  

  useEffect(() => {
    if(client && isConnected) {
      const subscription = client.subscribe('/topic/messages', (message) => {
        // thêm vào message vào state khi nhận được
        if (message.body) {
            const newMessage = JSON.parse(message.body);
            setMessages((previousMessages) => [...previousMessages, newMessage]);
          }
      });

      // Unsubscribe khi unmount
      return () => {
        subscription.unsubscribe();
      }
    }
  }, [client, isConnected]);

  // Trả về Provider với value là client và status connect
  return (
    <WebSocketContext.Provider value={{client,setClient, isConnected,setIsConnected, messages,setMessages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export function useWebsocket(): WBContextType {
  const context = useContext(WebSocketContext);
  if (!context)
      throw new Error('useUser must be used within an UserContextProvider');
  return context;
}