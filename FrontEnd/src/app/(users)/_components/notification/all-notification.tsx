'use client'
import { Layout } from "antd";
import { UserCard } from "../user/user-card";
import { Typography } from "antd";
import NotificationCard from "./notification-card";
import useSWR from "swr";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { getAllNotifications } from "services/main/clientRequest/notificationsClient";
import { Loading } from "@components/ui/loading";
import { Error } from "@components/ui/error";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "context/auth-context";
import { useUser } from "context/user-context";
import { getCookie, getCookies } from "cookies-next";
const { Sider, Content } = Layout;
const { Title } = Typography;
import { cookies } from "next/headers";
export default function AllNotification() {
  const user = useAuth();
  

  console.log("abcfgdfgdfgdfg",user);

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useSWR(getAllNotifications("a125b897-1012-4e8c-ac64-60e3263f7252"), fetcherWithToken);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log("abc", data2);
  console.log(isLoading2);
  console.log(error2);

  var notificationsTypeFriend =
    data2 &&
    data2.data.filter((value: any) => value.notificationType === "FRIEND");

  var notificationsTypeNormal =
    data2 &&
    data2.data.filter((value: any) => value.notificationType === "NORMAL");

  var notificationsToday =
    data2 &&
    data2.data.filter((value: any) => {
      // Lọc ra các thông báo có notificationType là "Like" hoặc "Comment"
      if (
        value.notificationType === "LIKE" ||
        value.notificationType === "COMMENT" || value.notificationType === "TAG"
      ) {
        var notificationDate = new Date(value.createdDate);
        console.log(notificationDate.getTime(),"sdgfg")
       
        return notificationDate.setHours(0, 0, 0, 0) === today.getTime();
      }
      return false; // Không phải là "Like" hoặc "Comment"
    });
  return (
    <Layout>
      {isLoading2 ? (
        <Loading className="mt-5" />
      ) : !data2.data ? (
        <Error message="Something went wrong" />
      ) : (
        <>
          <Content style={{ background: "#fff", padding: "20px" }}>
            <Title level={5} className="ml-1">
              Tương tác với bạn
            </Title>
            <>
              <AnimatePresence mode="popLayout">
                {notificationsToday &&
                  notificationsToday.map((item: any, index: number) => {
                    return <NotificationCard key={index} data={item} />;
                  })}
              </AnimatePresence>
              {/* <LoadMore />*/}
            </>
          </Content>

          <Content style={{ background: "#fff", padding: "20px" }}>
            <Title level={5} className="ml-1">
              Lời mời kết bạn
            </Title>
            <>
              <AnimatePresence mode="popLayout">
                {notificationsTypeFriend &&
                  notificationsTypeFriend.map((item: any, index: number) => {
                    return <NotificationCard key={index} data={item} />;
                  })}
              </AnimatePresence>
              {/* <LoadMore />*/}
            </>
          </Content>
          <Content style={{ background: "#fff", padding: "20px" }}>
            <Title level={5} className="ml-1">
              Bài viết khác
            </Title>
            <>
              <AnimatePresence mode="popLayout">
                {notificationsTypeNormal &&
                  notificationsTypeNormal.map((item: any, index: number) => {
                    return <NotificationCard key={index} data={item} />;
                  })}
              </AnimatePresence>
              {/* <LoadMore />*/}
            </>
          </Content>
        </>
      )}
    </Layout>
  );
}
