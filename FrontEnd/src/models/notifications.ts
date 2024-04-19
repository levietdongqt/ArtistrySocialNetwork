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

export enum FollowButtonType {
    FOLLOW = "Đang theo dõi bạn",
    UN_FOLLOW = "Không theo dõi bạn",
    FOLLOW_BUTTON = "Theo dõi",
    FRIEND = "Bạn bè",
    FOLLOWING_BUTTON = "Đang Theo dõi",
    UN_FOLLOW_BUTTON = "Bỏ theo dõi",  
    ADD_FRIEND_BUTTON= "Kết bạn",
    PENDING_BUTTON= "Đang chờ đồng ý",
    FRIENDED_BUTTON = "Đang là bạn bè",
    REMOVE_FRIEND_BUTTON ="Hủy kết bạn"
}