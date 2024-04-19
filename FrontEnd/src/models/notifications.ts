import { User } from "./user";

export type NotificationModel = {
    id: string;
    type?: string;
    notificationType?: string;
    createdDate: string;
    userFrom?: User
    userTo?: User
    link?: string;
    message?: string;
    status?: boolean;
    delivered: boolean;
};

export const notificationString: string[] = [
    "đã gửi lời mời kết bạn",
    "đã bình luận bài viết của bạn",
    "đã like ảnh của bạn",
    "đã đăng",
    "đã tag bạn vào bài viết của họ",
  ];

  export enum AddFriendType {
    AcceptedFriend = "Đã chấp nhận lời mời kết bạn",
    UnAcceptFriend = "Đã từ chối lời mời kết bạn"
}

export enum AddFriendButtonType {
    OK = "Đồng ý",
    DENY = "Từ chối"
}