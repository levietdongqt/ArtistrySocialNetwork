import {ConversationDto, ConversationMember} from "@models/conversation";
import {MessageDto} from "@models/message";


const initState: stateType = {
    conversations: [], // Mảng rỗng ban đầu
    pickedConversations: [undefined, undefined, undefined], // Mảng rỗng ban đầu
    curConversation: undefined,
    showChatBoxes: [false, false, false],
    showConversations: false,
    showChatAlert: true,
    showNotifyMessage: undefined
}

export type  stateType = {
    conversations: ConversationDto[];
    pickedConversations: (ConversationDto | undefined)[];
    curConversation: ConversationDto | undefined;
    showChatBoxes: boolean[];
    showConversations: boolean;
    showChatAlert: boolean;
    showNotifyMessage: string | undefined;
}

const enum ACTION_TYPE {

    SET_CONVERSATIONS = "SET_CONVERSATIONS",
    ADD_CONVERSATION = "ADD_CONVERSATION",
    UPDATE_CONVERSATION = "UPDATE_CONVERSATION",
    SET_NEW_MESSAGES = "SET_NEW_MESSAGES",
    SET_PICKED_CONVERSATIONS = "SET_PICKED_CONVERSATIONS",
    UPDATE_PICKED_CONVERSATION = "UPDATE_PICKED_CONVERSATION",
    SHOW_CONVERSATIONS = "SHOW_CONVERSATIONS",
    SHOW_CHAT_BOXES = "SHOW_CHAT_BOXES",
    SHOW_CHAT_ALERT = "SHOW_CHAT_ALERT",
    UPDATE_SEEN_FLAG = "UPDATE_SEEN_FLAG"

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
            const conversations = [...action.payload] as ConversationDto[];
            if (!(conversations?.length > 0))
                return state;
            const updatedConversations = conversations.map(conversation => initMemberMapOfConversation(conversation));

            newState = {
                ...state,
                conversations: updatedConversations
            }
            break;

        case ACTION_TYPE.ADD_CONVERSATION:
            const newConversation1 = action.payload as ConversationDto;
            const isExist = state.conversations.every((value: ConversationDto) => value.id === newConversation1.id)
            if (isExist) return state
            newState = {
                ...state,
                conversations: [
                    {...initMemberMapOfConversation(newConversation1)}
                    , ...state.conversations]
            }
            break;

        // replace oldConversation by newConversation and push newConversation to top conversations
        case ACTION_TYPE.UPDATE_CONVERSATION:
            const newConversation = action.payload as ConversationDto
            let newConversationList = [...state.conversations];
            // const curConIndex = newConversationList.findIndex((conversation: ConversationDto) => conversation.id === newConversation.id)
            const curConIndex = findIndexOfConversation(newConversationList, newConversation.id)
            if (curConIndex !== -1) {
                newConversationList.splice(curConIndex, 1)
            }
            // let curPickedIndex1 = findIndexOfConversation(state.pickedConversations, newConversation.id)
            // if (curPickedIndex1 !== -1 && state.showChatBoxes[curPickedIndex1]) {
            //     newConversation.members.forEach(member => member.notSeen = false)
            // }
            newState = {
                ...state,
                conversations: [{
                    ...initMemberMapOfConversation(newConversation)
                }, ...newConversationList]
            }
            break;

        case ACTION_TYPE.SET_NEW_MESSAGES:
            const messages = action.payload as MessageDto[]
            if (messages.length === 0) {
                return state
            }
            // curPickedIndex = state.pickedConversations.findIndex((value: ConversationDto) => value?.id === messages[0].conversationId)
            curPickedIndex = findIndexOfConversation(state.pickedConversations, messages[0].conversationId!)
            if (curPickedIndex === -1) {
                throw new Error("Current Conversation not found!")
            }
            const newCurConversation1: ConversationDto = {
                ...state.pickedConversations[curPickedIndex]!,
                messages: action.payload
            };
            newPickedConversations = replaceConversationInList(state.pickedConversations, curPickedIndex, newCurConversation1)
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

        case ACTION_TYPE.UPDATE_PICKED_CONVERSATION:
            const conversation = {...action.payload} as ConversationDto
            // curPickedIndex = state.pickedConversations.findIndex((value: ConversationDto) => value?.id === newMessage.conversationId)
            curPickedIndex = findIndexOfConversation(state.pickedConversations, conversation.id)
            if (curPickedIndex === -1) {
                const sender = conversation.members.find(member => member.id === conversation.lastMessage?.senderId)

                console.log("New message is not in picked conversation")
                newState = {
                    ...state,
                    showNotifyMessage: `${sender?.nickname}: ${conversation.lastMessage?.content}`
                }
                break;
            }
            const curPickedConversation = state.pickedConversations[curPickedIndex]!
            const newCurConversation: ConversationDto = {
                ...curPickedConversation,
                members: conversation.members,
                lastMessage: conversation.lastMessage,
                updatedAt: conversation.lastMessage!.sendTime,
                messages: curPickedConversation.messages ? [...curPickedConversation.messages, conversation.lastMessage!] : [conversation.lastMessage!]

            }
            const updateCurCon =   initMemberMapOfConversation(newCurConversation)
            // newPickedConversations = [...state.pickedConversations]
            // newPickedConversations[curPickedIndex] = newCurConversation
            newPickedConversations = replaceConversationInList(state.pickedConversations, curPickedIndex, updateCurCon)
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

        case ACTION_TYPE.SHOW_CHAT_ALERT:
            newState = {
                ...state,
                showChatAlert: action.payload
            }
            break;

        case ACTION_TYPE.UPDATE_SEEN_FLAG:
            curConversation = action.payload as ConversationDto
            let newConversations = [...state.conversations] as ConversationDto[]
            console.log("UPDATE_SEEN_FLAG: ", newConversations, newConversations.length)
            if (!newConversations) {
                console.log("FALSE")
            }
            const curConversationsIndex = findIndexOfConversation(state.conversations, curConversation.id)
            if (curConversationsIndex === -1) {
                return state
            }
            updateConversationMembers(newConversations[curConversationsIndex], curConversation.members)
            curPickedIndex = findIndexOfConversation(state.pickedConversations, curConversation.id)
            if (curPickedIndex === -1) {
                newState = {
                    ...state,
                    conversations: newConversations
                }
                break;
            } else {
                let newPickedCon = [...state.pickedConversations]
                // newPickedCon[curPickedIndex].members = curConversation.members
                // initMemberMapOfConversation(newPickedCon[curPickedIndex])
                updateConversationMembers(newPickedCon[curPickedIndex], curConversation.members)
                newState = {
                    ...state,
                    pickedConversations: newPickedCon,
                    conversations: newConversations
                }
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

export function initMemberMapOfConversation(conversation: ConversationDto) {
    if (conversation.id === "663a292ce8832b7b50e3076c") {
        console.log("initMemberMapOfConversation: ", {...conversation})
    }
    const memberMap = new Map<string, ConversationMember>()
    conversation.members.forEach(member => {
        memberMap.set(member.id, member)

    })
    return {...conversation, memberMap: memberMap} as ConversationDto;
}

export function findIndexOfConversation(conversations: (ConversationDto | undefined)[], conversationId: string): number {
    return conversations.findIndex((value: ConversationDto | undefined) => value?.id === conversationId)
}

function replaceConversationInList(conversations: ConversationDto[], indexReplace: number, newConversation: ConversationDto) {
    const newPickedConversations = [...conversations]
    newPickedConversations[indexReplace] = newConversation
    return newPickedConversations;
}

function updateConversationMembers(conversation: ConversationDto, newMembers: ConversationMember[]) {
    conversation.members = newMembers;
    initMemberMapOfConversation(conversation)
}

export {reducer, initState, ChatAction, ACTION_TYPE};
