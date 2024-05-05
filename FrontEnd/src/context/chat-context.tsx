'use client'
import {createContext, Dispatch, useContext, useEffect, useReducer, useRef, useState} from 'react';
import {ConversationDto} from "@models/conversation";
import {MessageDto} from "@models/message";
import {initState, reducer, stateType} from "@lib/reducer/chat-reducer";
import {toastMessage} from "@components/chat-box/chat-box-socket-helper";

type ChatContextType = {
    state: stateType,
    dispatch: Dispatch<any>,
    reRender: number,
    setReRender: (func: (prev: number) => number) => void
};
export const ChatContext = createContext<ChatContextType | undefined>(undefined);
export default function ChatContextProvider({children}: any): JSX.Element {
    // const [curConversation, setCurConversation] = useState<ConversationDto>()
    const [reRender, setReRender] = useState(0)
    const [state, dispatch] = useReducer(reducer, initState)
    const {showNotifyMessage} = state
    const values = {
        state: state,
        dispatch: dispatch,
        reRender: reRender,
        setReRender: setReRender
        // curConversation,
        // setCurConversation,
        // updateMessage,
        // setMessages,
    }
    useEffect(() => {
        showNotifyMessage && toastMessage(showNotifyMessage)
    }, [showNotifyMessage]);
    return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextType {
    const context = useContext(ChatContext);
    if (!context)
        throw new Error('chatContext must be used within an ChatContextProvider');
    return context;
}
