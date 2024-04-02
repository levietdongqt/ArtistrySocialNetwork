"use client";
import { Layout } from "antd";
import NotificationCard from "./notification-card";
import useSWR from "swr";
import { getUnreadNotifications } from "services/main/clientRequest/notificationsClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { Loading } from "@components/ui/loading";
import { AnimatePresence } from "framer-motion";
import { Error } from "@components/ui/error";
const { Sider, Content } = Layout;

export default function UnreadNotification() {
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useSWR(getUnreadNotifications(), fetcherWithToken);
  console.log("abc", data2);
  console.log(isLoading2);
  console.log(error2);

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
            data2.data.map((item: any, index : number) => {
              return (
                <NotificationCard key={index} data={item}/>
              )
            })
          }
            </AnimatePresence>
            {/* <LoadMore />*/}
          </>
        )}
      </Content>
    </Layout>
  );
}
