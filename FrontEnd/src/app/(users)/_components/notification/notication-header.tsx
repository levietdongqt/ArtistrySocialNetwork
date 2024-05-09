"use client";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { Popover} from "antd";
import { Button } from '@components/ui/button';
import { HeroIcon } from "@components/ui/hero-icon";
import { useEffect, useState } from "react";
import { NopeNotificationModel, NotificationTab } from "@models/notifications";
import { useNotification } from "context/notification-context";
import useSWR from "swr";
import {
  saveNopeNotifications,
  updateAllNotification,
} from "services/main/clientRequest/notificationsClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useUser } from "context/user-context";
import { NotificationButton } from "@components/ui/notification-button";
import { toast } from "react-toastify";
const { Title } = Typography;

export default function NotificationHeader() {
  const { currentUser } = useUser();
  const {
    updatedNotifications,
    setUpdatedNotifications,
    setReRenderNotifications,
  } = useNotification();
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [data, setData] = useState<NopeNotificationModel>();
  const [shouldSaveNope, setShouldSaveNope] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handleMouseEnter = () => setHovered(!hovered);
  const {} = useSWR(
    shouldUpdate ? updateAllNotification(updatedNotifications) : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        toast.success("Chuyển trạng thái thành công!!")
    },
    onError(err, key, config) {
      toast.error("Chuyển trạng thái thất bại!!")
    },
    }
  );

  // const {} = useSWR(
  //   shouldUpdate
  //     ? saveNopeNotifications(
  //         currentUser?.id as string,
  //         data as NopeNotificationModel
  //       )
  //     : null,
  //   fetcherWithToken,
  //   {
  //     revalidateOnFocus: false,
  //     onSuccess(data, key, config) {
  //         toast.success("Chặn thông báo thành công!!")
  //     },
  //     onError(err, key, config) {
  //       toast.error("Chặn thông báo thất bại!!")
  //     },
  //   }
  // );

  const handleUpdateAll = () => {
    setShouldUpdate(true);
  };


  useEffect(() => {
    if (shouldUpdate) {
      setUpdatedNotifications((prev) => []);
      setShouldUpdate(false);
      setReRenderNotifications((prev) => true);
    }
  }, [shouldUpdate]);

  useEffect(() => {
    if (shouldSaveNope) {
      setShouldSaveNope(false);
    }
  }, [shouldSaveNope]);

  const content = (
    <div className="flex flex-col">
      <Button
            className='dark-bg-tab min-w-[135px] self-start border border-light-line-reply px-4 py-1.5 
            font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red' 
        onClick={handleUpdateAll}
      >
        <span>Tích toàn bộ là đã đọc</span>
      </Button>
      <NotificationButton userTargetId={currentUser?.id as string} hovered={hovered} userTargetUsername={currentUser?.fullName as string}/>
    </div>
  );
  return (
    <Row className="flex justify-between mt-3 font-semibold">
      <Col span={8}>
        <Title level={3} className="ml-4">
          {NotificationTab.TITLE}
        </Title>
      </Col>
      <Col span={8}>
        <div className="flex justify-end mr-4">
          <Popover content={content} trigger="click" placement="bottom" afterOpenChange={handleMouseEnter}>
            <Button>
              <HeroIcon iconName="Cog8ToothIcon" />
            </Button>
          </Popover>
        </div>
      </Col>
    </Row>
  );
}
