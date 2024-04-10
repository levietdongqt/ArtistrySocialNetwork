import {User} from "@models/user";

export type Comments = {
     id: string;
     content: string;
    sentDate : string;
    updatedDate : string;
    mediaUrl: [];
     postId: string;
     commentId: string;
    byUser: User;
    commentsLikes:[];
    tagUserComments:[];
    totalLikes: number;
    totalReply: number;
};
