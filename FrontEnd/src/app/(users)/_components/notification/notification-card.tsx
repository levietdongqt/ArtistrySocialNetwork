"use client"
import Link from "next/link";
import { UserAvatar } from "../user/user-avatar";
import { Typography,Button } from "antd";
import { useRouter } from "next/router";
const { Title } = Typography;
const { Text } = Typography;
const notificationString: string[] = [
  "đã gửi lời mời kết bạn",
  "đã thêm ảnh mới",
  "đã bình luận bài viết của",
  "đã like ảnh của bạn"
];

interface NotificationCardParams {
    addFriend: boolean
}

export default function NotificationCard({addFriend} : NotificationCardParams){
  return (
    <Link
      href={`/user/${"username"}`}
      className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
    >
      <div className="flex items-center">
        <UserAvatar
          src={"https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
          alt={"name"}
          username={"username"}
        />
        <div className="flex flex-col justify-center ml-3">
          {" "}
          {/* Thêm margin left cho khoảng cách */}
          <div>
            <Text strong>Minh Nhật</Text> {/* Thêm một khoảng trắng */}
            <Text>{notificationString[0]}</Text>
          </div>
          {/* <br /> không cần thiết trong React */}
          <Text>12h</Text>
          {addFriend && (
            <div className="w-full flex justify-between">
              <Button type="primary" style={{ width: "48%",backgroundColor:"Highlight" }}>Đồng ý</Button>
              <Button type="default" style={{ width: "48%",backgroundColor:"whitesmoke" }}>Xóa</Button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
