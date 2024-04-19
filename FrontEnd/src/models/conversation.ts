import {MessageDto} from "@models/message";

export type ConversationDto = {
    id: string;
    name: string;
    members: ConversationMember[];
    lastMessage: MessageDto;
    updatedAt?: Date;
    createAt?: Date;
    messages: MessageDto[];

}
export type ConversationMember = {
    id: string,
    nickname: string,
    fullName: string,
    avatar: string,
    coverImage: string
}