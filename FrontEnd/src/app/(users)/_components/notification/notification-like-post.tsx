"use client";
import Link from "next/link";
import { UserAvatar } from "../user/user-avatar";
import { Typography, Button, Tooltip, Popover, Avatar } from "antd";
import {
  DashOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  NotificationModel,
} from "@models/notifications";
const { Text } = Typography;

interface NotificationCardParams {
  data: NotificationModel[];
}

export default function NotificationPostCard({ data }: NotificationCardParams) {
  const content = (
    <div className="flex flex-col">
      <Button>Gỡ thông báo này</Button>
    </div>
  );

  return (
    <Link
      href={`/post/${data[0]?.link}`}
      className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
      onClick={(e) => {}}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <Avatar.Group maxCount={5} >
            {" "}
            {data?.map((notify: any, index: any) => {
              return (
                !notify.status && (     
                    <UserAvatar
                      src={"https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
                      alt={"name"}
                      username={`${notify?.id}`}
                    />
                )
              );
            })}
          </Avatar.Group>
          </div>
          <Text> {" "} {data[0]?.message}</Text>  
        <div className="absolute right-10">
          {" "}
          <Tooltip placement="bottomRight" title={"Ấn vào để xem chi tiết"}>
            {!status && <EyeOutlined />}
          </Tooltip>
          <Popover placement="bottomLeft" content={content}>
            <Button shape="circle" icon={<DashOutlined />} className="ml-3" />
          </Popover>
        </div>
      </div>
    </Link>
  );
}
