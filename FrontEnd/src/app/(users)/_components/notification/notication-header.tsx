"use client";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { Popover, Button } from "antd";
import { HeroIcon } from "@components/ui/hero-icon";
import { useEffect, useState } from "react";
import { NotificationTab } from "@models/notifications";
import { useNotification } from "context/notification-context";
import { CheckOutlined} from "@ant-design/icons";
import useSWR from "swr";
import { updateAllNotification } from "services/main/clientRequest/notificationsClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
const { Title } = Typography;

export default function NotificationHeader() {
  const { updatedNotifications,setUpdatedNotifications,setReRenderNotifications} = useNotification();
  const [shouldUpdate,setShouldUpdate] = useState(false);
  const {
} = useSWR(shouldUpdate ? updateAllNotification(updatedNotifications): null, fetcherWithToken,{
    revalidateOnFocus: false,
});

  const handleUpdateAll = () => {
    setShouldUpdate(true);
  }

  useEffect(()=>{
    if(shouldUpdate){ 
      setUpdatedNotifications((prev) => []);
      setShouldUpdate(false);
      setReRenderNotifications((prev) => true)
    }
  },[shouldUpdate])

  const content = (
    <div>
    <Button className="border-none" onClick={handleUpdateAll}> <CheckOutlined />Tích tất cả là đã đọc</Button>
    {/* <Button className="border-none" onClick={handle}> <CheckOutlined /></Button> */}
    </div>
  )
  return (
    <Row className="flex justify-between mt-3 font-semibold">
      <Col span={8}>
        <Title level={3} className="ml-4">
          {NotificationTab.TITLE}
        </Title>
      </Col>
      <Col span={8}>
        <div className="flex justify-end mr-4">
          <Popover
            content={content}
            trigger="click"
            placement="bottom"
          >
            <Button>
            <HeroIcon iconName="Cog8ToothIcon" />
            </Button>
          </Popover>
        </div>
      </Col>
    </Row>
  );
}
