"use client";
import Link from "next/link";
import { UserAvatar } from "../user/user-avatar";
import { Typography, Tooltip, Popover, Avatar } from "antd";
import { Button } from "@components/ui/button";
import { DashOutlined, EyeOutlined } from "@ant-design/icons";
import { NotificationModel } from "@models/notifications";
import { UserTooltip } from "../user/user-tooltip";
const { Text } = Typography;

interface NotificationCardParams {
  data: NotificationModel[];
}

export default function NotificationPostCard({ data }: NotificationCardParams) {
  const content = (
    <div className="flex flex-col">
      <Button
        className="dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5 
                       font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
      >
        Gỡ thông báo này
      </Button>
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
          <Avatar.Group maxCount={5}>
            {" "}
            {data?.map((notify: any, index: any) => {
              return (
                !notify.status && (
                  <UserTooltip avatarCheck={true} {...notify?.userTo}>
                    <UserAvatar
                      src={
                        notify?.userTo.avatar ||
                        "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"
                      }
                      alt={"name"}
                      username={`${notify?.id}`}
                      key={index}
                    />
                  </UserTooltip>
                )
              );
            })}
          </Avatar.Group>
        </div>
        <div>
          <Text> {data[0]?.message}</Text>
        </div>
        <div className="absolute right-10">
          {" "}
          <Tooltip placement="bottomRight" title={"Ấn vào để xem chi tiết"}>
            <EyeOutlined />
          </Tooltip>
          <Popover placement="bottomLeft" content={content}>
            <Button className="ml-3">
              <DashOutlined />
            </Button>
          </Popover>
        </div>
      </div>
    </Link>
  );
}
