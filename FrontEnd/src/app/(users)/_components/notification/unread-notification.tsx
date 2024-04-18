"use client";
import { Layout } from "antd";
import NotificationCard from "./notification-card";
import useSWR from "swr";
import { getUnreadNotifications } from "services/main/clientRequest/notificationsClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { Loading } from "@components/ui/loading";
import { AnimatePresence } from "framer-motion";
import { Error } from "@components/ui/error";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { useNotification } from "context/notification-context";
import { HeroIcon } from "@components/ui/hero-icon";
const { Sider, Content } = Layout;

export default function UnreadNotification() {
  const user = useUser();
  const {notificationsContent} = useNotification();
  const [dataUnread,setDataUnread] = useState<any>([]);
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useSWR(getUnreadNotifications(user.currentUser?.id as string), fetcherWithToken);

  useEffect(()=>{
    setDataUnread(data2?.data);
  },[data2])

  useEffect(()=>{
    setDataUnread([notificationsContent,...dataUnread]);
  },[notificationsContent])

  return (
    <Layout>
      <Content style={{ background: "#fff", padding: "20px" }}>
        {isLoading2 ? (
          <Loading className="mt-5" />
        ) : !data2.data ? (
          <Error message="Something went wrong" />
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {
            dataUnread.map((item: any, index : number) => {
              return (
                <NotificationCard key={index} data={item}/>
              )
            })
          }
          {
            dataUnread.length===0 && (
              <div className="text-center">
                <HeroIcon
                iconName="BellAlertIcon" className="mx-auto w-20"></HeroIcon>
                <p className="text-gray-500 text-lg">Bạn không có thông báo nào </p>
              </div>
            )
          }
            </AnimatePresence>
            {/* <LoadMore />*/}
          </>
        )}
      </Content>
    </Layout>
  );
}
