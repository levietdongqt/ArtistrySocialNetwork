"use client"
import Link from "next/link";
import { UserAvatar } from "../user/user-avatar";
import { Typography,Button } from "antd";
import { useRouter } from "next/router";
import { formatElapsedTime } from "@lib/helper/convertTime";
import { EyeOutlined } from '@ant-design/icons';
import useSWR from "swr";
import { updateNotification } from "services/main/clientRequest/notificationsClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useState } from "react";
const { Title } = Typography;
const { Text } = Typography;
const notificationString: string[] = [
  "đã gửi lời mời kết bạn",
  "đã bình luận bài viết của bạn",
  "đã like ảnh của bạn",
  "đã đăng",
  "đã tag bạn vào bài viết của họ"
];

interface NotificationCardParams {
    data: Notification,
}
type Notification = {
  id: string;
  type?: string;
  notificationType?: string;
  createdDate: string;
  userFrom?: {
    userId?: string;
    userName?: string;
  };
  userTo?: {
    userId?: string;
    userName?: string;
  };
  link?: string;
  message?: string;
  status? :boolean;
} 

export default function NotificationCard({data} : NotificationCardParams){
  const [shouldFetch,setShouldFetch] = useState(false)
  var currentDate = new Date();
  var specificDate = new Date(data.createdDate);
  var timeDifference = currentDate.getTime() - specificDate.getTime();
  var timeDifferenceInSeconds = formatElapsedTime(timeDifference);
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useSWR(shouldFetch ? updateNotification(data.id): null, fetcherWithToken);
  
  return (
    <Link
      href={`/user/${data.link}`}
      className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
      onClick={() => setShouldFetch(true)}
    >
     
      <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <UserAvatar
          src={"https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
          alt={"name"}
          username={`${data.id}`}
        />
        <div className="flex flex-col justify-center ml-3">
          {" "}
          {/* Thêm margin left cho khoảng cách */}
          <div>
            <Text strong>{data.userTo?.userName}</Text> {/* Thêm một khoảng trắng */}
            {
             data.notificationType==='FRIEND' && <Text>{notificationString[0]}</Text>
            }
             {
             data.notificationType==='COMMENT' && <Text>{notificationString[1]}</Text>
            }
             {
             data.notificationType==='LIKE' && <Text>{notificationString[2]}</Text>
            }
             {
             data.notificationType==='NORMAL' && <Text>{notificationString[3]}: {data.message}</Text>
            }
             {
             data.notificationType==='TAG' && <Text>{notificationString[4]}</Text>
            }
          </div>
          {/* <br /> không cần thiết trong React */}
          <Text>{timeDifferenceInSeconds}</Text>
          {data.notificationType==='FRIEND' && (
            <div className="w-full flex justify-between">
              <Button type="primary" style={{ width: "48%",backgroundColor:"Highlight" }}>Đồng ý</Button>
              <Button type="default" style={{ width: "48%",backgroundColor:"whitesmoke" }}>Xóa</Button>
            </div>
          )}
        </div>
        </div>
        <div className="absolute right-10"> {/* Sử dụng ml-auto của Tailwind CSS */}
        { !data.status &&
          <EyeOutlined />
        }
        </div>
      </div>
    </Link>
  );
}
