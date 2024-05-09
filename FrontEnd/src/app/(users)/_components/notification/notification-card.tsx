"use client";
import Link from "next/link";
import { UserAvatar } from "../user/user-avatar";
import { Typography, Tooltip, Popconfirm, Popover } from "antd";
import { Button } from '@components/ui/button';
import { formatElapsedTime } from "@lib/helper/convertTime";
import {
  DashOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import useSWR, { mutate } from "swr";
import { deleteNotification, getAllNotifications, updateNotification } from "services/main/clientRequest/notificationsClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useEffect, useState } from "react";
import { useUser } from "context/user-context";
import {
  acceptFriend,
  unAcceptFriend,
} from "services/main/clientRequest/friendsClient";
import {
  AddFriendButtonType,
  AddFriendType,
  NotificationModel,
} from "@models/notifications";
import { UserTooltip } from "../user/user-tooltip";
import { useNotification } from "context/notification-context";
import { NotificationButton } from "@components/ui/notification-button";
import { toast } from "react-toastify";
const { Text } = Typography;

interface NotificationCardParams {
  data: NotificationModel;
}

export default function NotificationCard({ data }: NotificationCardParams) {
  const [shouldUpdateFetch, setShouldUpdateFetch] = useState(false);
  const [shouldDeleteFetch, setShouldDeleteFetch] = useState(false);
  const [shouldAcceptFriend, setShouldAcceptFriend] = useState(false);
  const [shouldUnAcceptFriend, setShouldUnAcceptFriend] = useState(false);
  const [successAccept, setSuccessAccept] = useState(false);
  const [successUnAccept, setUnSuccessAccept] = useState(false);
  const { reRenderNotifications } = useNotification();
  const [hovered, setHovered] = useState(false);
  const [status, setStatus] = useState<any>(false);
  var currentDate = new Date();
  var specificDate = new Date(data?.createdDate);
  var timeDifference = currentDate.getTime() - specificDate.getTime();
  var timeDifferenceInSeconds = formatElapsedTime(timeDifference);
  const handleMouseEnter = () => setHovered(!hovered);
  
  const content = (
    <div className="flex flex-col">
      <Button
        className="dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5 
                       font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={(e)=> {
          e.preventDefault();
          setShouldUpdateFetch(true);
        }}
      >
        Gỡ thông báo này
      </Button>
      <NotificationButton
        userTargetUsername={data?.userTo?.fullName as string}
        userTargetId={data?.userTo?.id as string}
        hovered={hovered}
      />
    </div>
  );
  
  useEffect(() => {
    setStatus(data?.status);
  }, [data]);

  useEffect(() => {
    if (data?.status === true) {
      setStatus(true);
    }
  }, [reRenderNotifications]);

  const user = useUser();
  const {} = useSWR(
    shouldUpdateFetch ? updateNotification(data?.id) : null,
    fetcherWithToken,{
      onSuccess(data, key, config) {
          setShouldDeleteFetch(true);
          mutate(getAllNotifications)
      },
    }
  );

  const {} = useSWR(
    shouldDeleteFetch ? deleteNotification(data?.id) : null,
    fetcherWithToken,{

    }
  );

  useEffect(() => {
    if (shouldUpdateFetch) {
      setShouldUpdateFetch(false);
    }
  }, [shouldUpdateFetch]);

  const { data: dataAcceptFriend } = useSWR(
    shouldAcceptFriend
      ? acceptFriend({
          userId: user.currentUser?.id as string,
          friendId: data.userTo?.id as string,
        })
      : null,
    fetcherWithToken,{
      onSuccess(data, key, config) {
          toast.success("Kết bạn thành công")
      },
      onError(err, key, config) {
          toast.error("Kết bạn thất bại")
      },
    }
  );
  const { data: undataAcceptFriend } = useSWR(
    shouldUnAcceptFriend
      ? unAcceptFriend({
          userId: user.currentUser?.id as string,
          friendId: data.userTo?.id as string,
        })
      : null,
    fetcherWithToken,{
      onSuccess(data, key, config) {
          toast.success("Từ chối kết bạn thành công")
      },
      onError(err, key, config) {
          toast.error("Từ chối kết bạn thất bại")
      },
    }
  );

  const handleAcceptFriend = () => {
    setShouldAcceptFriend(true);
    setShouldUpdateFetch(true);
    setSuccessAccept(true);
  };
  const handleSubmitDeny = () => {
    setShouldUnAcceptFriend(true);
    setShouldUpdateFetch(true);
    setUnSuccessAccept(true);
  };


  useEffect(() => {
    if (shouldAcceptFriend) {
      setShouldAcceptFriend(false);
    }
  }, [shouldAcceptFriend]);

  useEffect(() => {
    if (shouldUnAcceptFriend) {
      setShouldUnAcceptFriend(false);
    }
  }, [shouldUnAcceptFriend]);

  useEffect(() => {
    if (shouldDeleteFetch) {
      setShouldDeleteFetch(false);
    }
  }, [shouldDeleteFetch]);

  return (
    <Link
      href={data?.notificationType === "NORMAL" ? `post/${data?.link}` : `/profile/${data?.link}`}
      className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
      onClick={(e) => {
        if (data?.notificationType === "FRIEND") {
          e.preventDefault();
        }
        setShouldUpdateFetch(true);
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <UserTooltip avatarCheck={true} {...data?.userTo!}>
            <UserAvatar
              src={
                data?.userTo?.avatar ||
                "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"
              }
              alt={"name"}
              username={`${data?.id}`}
            />
          </UserTooltip>
          <div className="flex flex-col justify-center ml-3">
            {" "}
            <div>
              <Text strong>{data?.userTo?.fullName}</Text>{" "}
              <Text>{data?.message}</Text>
            </div>
            <Text>{timeDifferenceInSeconds}</Text>
            {data?.notificationType === "FRIEND" && (
              <div className="w-full flex justify-between">
                {successAccept && <Text>{AddFriendType.AcceptedFriend}</Text>}
                {successUnAccept && <Text>{AddFriendType.UnAcceptFriend}</Text>}
                {!successAccept && !successUnAccept && (
                  <>
                    <Button
                      style={{ width: "48%", backgroundColor: "Highlight" }}
                      onClick={handleAcceptFriend}
                    >
                      {AddFriendButtonType.OK}
                    </Button>
                    <Popconfirm
                      title="Từ chối kết bạn"
                      description="Bạn có chắc là không muốn kết bạn với người này không?"
                      icon={
                        <QuestionCircleOutlined
                          style={{
                            color: "red",
                          }}
                        />
                      }
                      onConfirm={handleSubmitDeny}
                    >
                      <Button
                        style={{ width: "48%", backgroundColor: "whitesmoke" }}
                      >
                        {AddFriendButtonType.DENY}
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="absolute right-10">
          {" "}
          <Tooltip placement="bottomRight" title={"Ấn vào để xem chi tiết"}>
            {!status && <EyeOutlined />}
          </Tooltip>
          <Popover
            placement="bottomLeft"
            content={content}
            onOpenChange={handleMouseEnter}
          >
            <Button className="ml-3" ><DashOutlined /></Button>
          </Popover>
        </div>
      </div>
    </Link>
  );
}
