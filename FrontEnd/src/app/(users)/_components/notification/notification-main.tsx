import NotificationHeader from "./notication-header";
import {Tabs } from 'antd';
import AllNotification from "./all-notification";
import UnreadNotification from "./unread-notification";

const items = [
    {
      label: 'Tất Cả',
      key: 'all',
      children: <AllNotification/>, // Truyền component vào children
    },
    {
      label: 'Chưa Đọc',
      key: 'unread',
      children: <UnreadNotification/>, // Truyền component vào children
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
