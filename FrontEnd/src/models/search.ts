import { User } from "./user"


export type SearchUser = {
    user :User
    isCheckFriend : IsCheckFriend
}

export type IsCheckFriend = {
    pending: Boolean;
    acceptFriend: Boolean;
    follow: Boolean;
    friend: Boolean
}

export enum EmptyPage  {
    USER= "Không tồn tại người dùng nào",
    SERVICE= "Không tồn tại dịch vụ nào",
    POST= "Không tồn tại bài viết nào"
}