
export type MessageDto = {
    id?: string;
    conversationId?: string;
    senderId: string;
    receiverIds? : string[];
    content: string;
    type: 'text' | 'image' | 'html' | 'custom';
    parentMessage?: {
        content: string;
        senderId: string;
        messageId: string;
    }
    likes?: number;
    sendTime: Date;
    seen?: boolean;
}