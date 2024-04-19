'use client'
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {ConversationDto} from "@models/conversation";
import {MessageDto} from "@models/message";

type ChatContextType = {
    curConversation: ConversationDto | undefined;
    setCurConversation: (conversation: ConversationDto) => void;
    updateMessage: (message: MessageDto) => void;
    setMessages: (message: MessageDto[]) => void;
    setReRender: (update: (prev: number) => number) => void;
    reRender: number
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);


export default function ChatContextProvider({children}: any): JSX.Element {
    const [curConversation, setCurConversation] = useState<ConversationDto>()
    const [reRender, setReRender] = useState(0)
    const curConversationRef = useRef<ConversationDto>();

    // Cập nhật ref mỗi khi curConversation thay đổi
    useEffect(() => {
        curConversationRef.current = curConversation;
    }, [curConversation]);

    const setMessages = (message: MessageDto[]) => {
        console.log("Set messages for new conversation")
        const updatedConversation = {...curConversationRef.current} as ConversationDto;
        updatedConversation.messages = [...message];
        setCurConversation(updatedConversation); // Cập nhật trạng thái mới dựa trên ref
    }
    const updateMessage = (message: MessageDto) => {
        console.log("update messages for conversation")
        const updatedConversation = {...curConversationRef.current} as ConversationDto;
        if (!updatedConversation.messages) {
            updatedConversation.messages = [message];
        } else {
            updatedConversation.messages.push(message);
        }
        setCurConversation(updatedConversation); // Cập nhật trạng thái mới dựa trên ref
    }
    const values = {
        curConversation,
        setCurConversation,
        updateMessage,
        setMessages,
        setReRender,
        reRender,
    }
    return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextType {
    const context = useContext(ChatContext);
    if (!context)
        throw new Error('chatContext must be used within an ChatContextProvider');
    return context;
}
