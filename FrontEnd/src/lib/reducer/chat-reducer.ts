import {ConversationDto, ConversationMember} from "@models/conversation";
import {MessageDto} from "@models/message";
import {messages} from "async-validator/dist-types/messages";


const initState: stateType = {
    conversations: [], // Mảng rỗng ban đầu
    pickedConversations: [undefined, undefined, undefined], // Mảng rỗng ban đầu
    curConversation: undefined,
    showChatBoxes: [false, false, false],
    showConversations: false
}

export type  stateType = {
    conversations: ConversationDto[];
    pickedConversations: (ConversationDto | undefined)[];
    curConversation: ConversationDto | undefined;
    showChatBoxes: boolean[];
    showConversations: boolean;
}

const enum ACTION_TYPE {
    SET_CONVERSATIONS = "SET_CONVERSATIONS",
    ADD_CONVERSATION = "ADD_CONVERSATION",
    UPDATE_CONVERSATIONS = "UPDATE_CONVERSATIONS",
    SET_NEW_MESSAGES = "SET_NEW_MESSAGES",
    SET_PICKED_CONVERSATIONS = "SET_PICKED_CONVERSATIONS",
    UPDATE_MESSAGE = "UPDATE_MESSAGE",
    SHOW_CONVERSATIONS = "SHOW_CONVERSATIONS",
    SHOW_CHAT_BOXES = "SHOW_CHAT_BOXES"

}

const ChatAction = (payload: any, type: ACTION_TYPE) => {
    return {
        type: type,
        payload
    }
}


const reducer = (state: any, action: any): stateType => {
    let newState: stateType;
    let curPickedIndex: number;
    let curConversation: ConversationDto;
    let newPickedConversations: (ConversationDto | undefined)[];
    switch (action.type) {
        case ACTION_TYPE.SET_CONVERSATIONS:
            const conversations = action.payload as ConversationDto[];
            conversations.forEach(conversation => {
                initMemberMap(conversation);
            })
            newState = {
                ...state,
                conversations: conversations
            }
            break;
        case ACTION_TYPE.ADD_CONVERSATION:
            const newConversation1 = action.payload as ConversationDto;
            const isExist = state.conversations.every((value: ConversationDto) => value.id === newConversation1.id)
            if (isExist) return state
            initMemberMap(newConversation1);
            newState = {
                ...state,
                conversations: [...state.conversations, newConversation1]
            }
            break;
        case ACTION_TYPE.UPDATE_CONVERSATIONS:
            const newConversation = action.payload as ConversationDto
            let newConversationList = [...state.conversations];
            const curConIndex = newConversationList.findIndex((conversation: ConversationDto) => conversation.id === newConversation.id)
            if (curConIndex !== -1) {
                newConversationList.splice(curConIndex, 1)
            }
            console.log("New Conversations:", newConversationList)
            initMemberMap(newConversation)
            newState = {
                ...state,
                conversations: [newConversation, ...newConversationList]
            }
            break;
        case ACTION_TYPE.SET_NEW_MESSAGES:
            const messages = action.payload as MessageDto[]
            if (messages.length === 0) {
                return state
            }
            console.log("NEW MESSAGES", messages)
            curPickedIndex = state.pickedConversations.findIndex((value: ConversationDto) => value?.id === messages[0].conversationId)
            if (curPickedIndex === -1) {
                throw new Error("Current Conversation not found!")
            }
            const newCurConversation1: ConversationDto = {
                ...state.pickedConversations[curPickedIndex]!,
                messages: action.payload
            };
            newPickedConversations = [...state.pickedConversations]
            newPickedConversations[curPickedIndex] = newCurConversation1
            newState = {
                ...state,
                pickedConversations: newPickedConversations
            }
            break;
        case ACTION_TYPE.SET_PICKED_CONVERSATIONS:
            newState = {
                ...state,
                pickedConversations: [...action.payload]
            }
            break;
        case ACTION_TYPE.UPDATE_MESSAGE:
            const newMessage = action.payload as MessageDto
            curPickedIndex = state.pickedConversations.findIndex((value: ConversationDto) => value?.id === newMessage.conversationId)
            if (curPickedIndex === -1) {
                console.log("New message is not in picked conversation")
                return state;
            }
            curConversation = state.pickedConversations[curPickedIndex]!
            const newCurConversation: ConversationDto = {
                ...curConversation,
                lastMessage: newMessage,
                updatedAt: newMessage.sendTime,
                messages: curConversation.messages ? [...curConversation.messages, newMessage] : [newMessage]

            }
            newPickedConversations = [...state.pickedConversations]
            newPickedConversations[curPickedIndex] = newCurConversation
            newState = {
                ...state,
                pickedConversations: newPickedConversations
            }
            break;
        case ACTION_TYPE.SHOW_CONVERSATIONS:
            newState = {
                ...state,
                showConversations: !state.showConversations
            }
            break;
        case ACTION_TYPE.SHOW_CHAT_BOXES:
            newState = {
                ...state,
                showChatBoxes: action.payload
            }
            break;
        default:
            throw new Error("Invalid action")
    }
    console.group("CHAT REDUCER CHANGE STATE")
    console.log(action.type, newState)
    console.groupEnd()
    return newState;
}

function initMemberMap(conversation: ConversationDto) {
    const memberMap = new Map<string, ConversationMember>()
    conversation.members.forEach(member => {
        memberMap.set(member.id, member)
    })
    conversation.memberMap = memberMap
}

const getCurrConversation = (pickedConversations: (ConversationDto | undefined)[], messgae: MessageDto) => {
    const curPickedIndex = pickedConversations.findIndex(value => value?.id === messgae.conversationId)
    if (curPickedIndex === -1) {
        throw new Error("Current Conversation not found!")
    }
    return pickedConversations[curPickedIndex]!
}

export {reducer, initState, ChatAction, ACTION_TYPE};
