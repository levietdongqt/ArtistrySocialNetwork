"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { getCookie } from "cookies-next";

type SocketContextType = {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
};

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const accessToken = getCookie("access_token");
    console.log("Access token:");
    if (!accessToken) {
      console.log("Access token not found");
      return;
    }

    const socket = io("http://localhost:8080", {
      // rejectUnauthorized: true,
      transports:["websocket"],
      // //withCredentials: true,
      // extraHeaders: {
      //   Authorization: `Bearer ${accessToken}`,
      // },
    });

    socket.on("connect", () => {
      console.log("Connected!");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected!");
    });

    socket.on("connect_error", (error) => {
      console.log("Connection Error: " + error.name + error.stack);
    });

    socket.on("/topic/messages", (message) => {
      if (message) {
        const newMessage = JSON.parse(message);
        setMessages((previousMessages) => [...previousMessages, newMessage]);
      }
    });

    setSocket(socket);
    console.log(socket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, setSocket, messages, setMessages }}
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
