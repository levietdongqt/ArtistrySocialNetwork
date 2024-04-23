import NotificationHeader from "./notication-header";
import {Tabs } from 'antd';
import AllNotification from "./all-notification";
import UnreadNotification from "./unread-notification";
import { NotificationTab } from "@models/notifications";

const items = [
    {
      label: NotificationTab.ALL,
      key: 'all',
      children: <AllNotification/>,
    },
    {
      label: NotificationTab.UNREAL,
      key: 'unread',
      children: <UnreadNotification/>,
    }
  ];


export default function NotificationMain() {
  return (
    <>
      <NotificationHeader />
      <Tabs items={items} className="ml-4" />
    </>
  );
}
