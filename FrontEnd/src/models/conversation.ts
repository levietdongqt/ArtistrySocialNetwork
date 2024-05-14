import {MessageDto} from "@models/message";
import {UserStatus} from "@chatscope/chat-ui-kit-react";

export type ConversationDto = {
    id: string;
    name: string;
    members: ConversationMember[];
    memberMap?: Map<string, ConversationMember>;
    lastMessage?: MessageDto;
    updatedAt?: Date;
    createAt?: Date;
    messages: MessageDto[];
    type: "PRIVATE" | "GROUP" | 'HIDE'

}
export type ConversationMember = {
    id: string,
    nickname: string,
    fullName?: string,
    avatar: string,
    coverImage?: string,
    notSeen: boolean,
    isExited?: boolean,
    notSeenTotal?: number,
    status?: UserStatus | undefined
    isGroupOwner?: boolean | undefined
}