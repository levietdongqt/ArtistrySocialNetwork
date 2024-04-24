import {MessageDto} from "@models/message";

export type ConversationDto = {
    id: string;
    name: string;
    members: ConversationMember[];
    memberMap?: Map<string, ConversationMember>;
    lastMessage: MessageDto;
    updatedAt?: Date;
    createAt?: Date;
    messages: MessageDto[];
    type: "PRIVATE" | "GROUP"

}
export type ConversationMember = {
    id: string,
    nickname: string,
    fullName: string,
    avatar: string,
    coverImage: string,
    notSeen : boolean,
}