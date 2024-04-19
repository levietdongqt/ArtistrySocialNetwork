"use client";
import Link from "next/link";
import { UserAvatar } from "../user/user-avatar";
import { Typography, Button, Tooltip, Popconfirm } from "antd";
import { formatElapsedTime } from "@lib/helper/convertTime";
import { EyeOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { updateNotification } from "services/main/clientRequest/notificationsClient";
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
  notificationString,
} from "@models/notifications";
import { UserTooltip } from "../user/user-tooltip";
const { Text } = Typography;

interface NotificationCardParams {
  data: NotificationModel;
}

export default function NotificationCard({ data }: NotificationCardParams) {
  const [shouldUpdateFetch, setShouldUpdateFetch] = useState(false);
  const [shouldAcceptFriend, setShouldAcceptFriend] = useState(false);
  const [shouldUnAcceptFriend, setShouldUnAcceptFriend] = useState(false);
  const [successAccept, setSuccessAccept] = useState(false);
  const [successUnAccept, setUnSuccessAccept] = useState(false);
  var currentDate = new Date();
  var specificDate = new Date(data?.createdDate);
  var timeDifference = currentDate.getTime() - specificDate.getTime();
  var timeDifferenceInSeconds = formatElapsedTime(timeDifference);
  const user = useUser();
  const {} = useSWR(
    shouldUpdateFetch ? updateNotification(data?.id) : null,
    fetcherWithToken
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
    fetcherWithToken
  );
  const { data: undataAcceptFriend } = useSWR(
    shouldUnAcceptFriend
      ? unAcceptFriend({
          userId: user.currentUser?.id as string,
          friendId: data.userTo?.id as string,
        })
      : null,
    fetcherWithToken
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

  return (
    <Link
      href={`/user/${data?.link}`}
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
        <UserTooltip avatarCheck {...data?.userTo!}>
          <UserAvatar
            src={"https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
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
                      type="primary"
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
                        type="default"
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
            {!data?.status && <EyeOutlined />}
          </Tooltip>
        </div>
      </div>
    </Link>
  );
}
