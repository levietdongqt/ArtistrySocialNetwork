"use client";
import { Layout } from "antd";
import { Typography, Avatar } from "antd";
import NotificationCard from "./notification-card";
import useSWR from "swr";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { getAllNotifications } from "services/main/clientRequest/notificationsClient";
import { Loading } from "@components/ui/loading";
import { Error } from "@components/ui/error";
import { AnimatePresence } from "framer-motion";
import { useUser } from "context/user-context";

const { Content } = Layout;
const { Title } = Typography;
import { useEffect, useRef, useState } from "react";
import { useNotification } from "context/notification-context";
import { NotificationModel, NotificationTab } from "@models/notifications";
import { UserTooltip } from "../user/user-tooltip";
import { UserAvatar } from "../user/user-avatar";
import NotificationPostCard from "./notification-like-post";
import { set } from "lodash";

export default function AllNotification() {
  const user = useUser();
  const {
    notificationsContent,
    setUpdatedNotifications,
    reRenderNotifications,
    setReRenderNotifications,
  } = useNotification();
  const [notificationsTypeFriend, setNotificationsTypeFriend] = useState<any>(
    []
  );
  const [notificationsTypeNormal, setNotificationsTypeNormal] = useState<any>(
    []
  );
  const [notificationsToday, setNotificationsToday] = useState<any>([]);
  const [notificationsLike, setNotificationsLike] = useState<any>([]);
  const [notificationsLikePost, setNotificationsLikePost] =
    useState<Map<string, any[]>>();
  const [notificationsTag, setNotificationsTag] = useState<any>([]);
  const [notificationsTagPost, setNotificationsTagPost] =
    useState<Map<string, any[]>>();
  const [notificationsComment, setNotificationsComment] = useState<any>([]);
  const [notificationsCommentPost, setNotificationsCommentPost] =
    useState<Map<string, any[]>>();

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useSWR(
    getAllNotifications(user.currentUser?.id as string),
    fetcherWithToken
  );
  useEffect(() => {
    switch (notificationsContent?.notificationType) {
      case "FRIEND":
        setNotificationsTypeFriend([
          notificationsContent,
          ...notificationsTypeFriend,
        ]);
        break;
      case "NORMAL":
        setNotificationsTypeNormal([
          notificationsContent,
          ...notificationsTypeNormal,
        ]);
        setUpdatedNotifications(
          (prev) => prev && [...prev, notificationsContent?.id]
        );
        break;
      case "FOLLOWING" || "ACCEPT_FRIEND":
        console.log("notificationsTypeFriend", notificationsTypeFriend);
        setNotificationsToday([notificationsContent, ...notificationsToday]);
        setUpdatedNotifications(
          (prev) => prev && [...prev, notificationsContent?.id]
        );
        break;
      case "LIKE":
        if (
          notificationsLikePost &&
          notificationsLikePost.has(notificationsContent.link)
        ) {
          notificationsLikePost
            .get(notificationsContent.link)
            ?.push(notificationsContent);
          setNotificationsLikePost(notificationsLikePost);
        } else {
          notificationsLikePost?.set(notificationsContent.link, [
            notificationsContent,
          ]);
          setNotificationsLikePost(notificationsLikePost);
        }
        break;
      case "TAG":
        if (
          notificationsTagPost &&
          notificationsTagPost.has(notificationsContent.link)
        ) {
          notificationsTagPost
            .get(notificationsContent.link)
            ?.push(notificationsContent);
          setNotificationsTagPost(notificationsTagPost);
        } else {
          notificationsTagPost?.set(notificationsContent.link, [
            notificationsContent,
          ]);
          setNotificationsTagPost(notificationsTagPost);
        }
        break;
      case "COMMENT":
        if (
          notificationsCommentPost &&
          notificationsCommentPost.has(notificationsContent.link)
        ) {
          notificationsCommentPost
            .get(notificationsContent.link)
            ?.push(notificationsContent);
          setNotificationsCommentPost(notificationsCommentPost);
        } else {
          notificationsCommentPost?.set(notificationsContent.link, [
            notificationsContent,
          ]);
          setNotificationsCommentPost(notificationsCommentPost);
        }
        break;
      default:
        break;
    }
  }, [notificationsContent]);

  useEffect(() => {
    if (reRenderNotifications) {
      setNotificationsTypeNormal(
        notificationsTypeNormal.map((value: any) => {
          return { ...value, status: true };
        })
      );
      setNotificationsToday(
        notificationsToday.map((value: any) => {
          return { ...value, status: true };
        })
      );
      setNotificationsLike(notificationsLike.map((value: any) => {
        return { ...value, status: true };
      }))
      setNotificationsTag(notificationsLike.map((value: any) => {
        return { ...value, status: true };
      }))
      setNotificationsComment(notificationsLike.map((value: any) => {
        return { ...value, status: true };
      }))
      setReRenderNotifications((prev) => false);
    }
  }, [reRenderNotifications]);

  useEffect(() => {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    setNotificationsTypeFriend(
      data2 &&
        data2.data.filter((value: any) => value.notificationType === "FRIEND")
    );
    setNotificationsTypeNormal(
      data2 &&
        data2.data.filter((value: any) => value.notificationType === "NORMAL")
    );
    setNotificationsToday(
      data2 &&
        data2.data.filter((value: any) => {
          if (
            value.notificationType === "FOLLOWING" ||
            value.notificationType === "ACCEPT_FRIEND"
          ) {
            var notificationDate = new Date(value.createdDate);
            return notificationDate.setHours(0, 0, 0, 0) === today.getTime();
          }
          return false;
        })
    );
    setNotificationsLike(
      data2 &&
        data2.data.filter((value: any) => {
          if (value.notificationType === "LIKE") {
            var notificationDate = new Date(value.createdDate);
            return notificationDate.setHours(0, 0, 0, 0) === today.getTime();
          }
          return false;
        })
    );

    setNotificationsLike(
      data2 &&
        data2.data.filter((value: any) => {
          if (value.notificationType === "LIKE" && !value.status) {
            var notificationDate = new Date(value.createdDate);
            return notificationDate.setHours(0, 0, 0, 0) === today.getTime();
          }
          return false;
        })
    );

    setNotificationsTag(
      data2 &&
        data2.data.filter((value: any) => {
          if (value.notificationType === "TAG" && !value.status) {
            var notificationDate = new Date(value.createdDate);
            return notificationDate.setHours(0, 0, 0, 0) === today.getTime();
          }
          return false;
        })
    );

    setNotificationsComment(
      data2 &&
        data2.data.filter((value: any) => {
          if (value.notificationType === "COMMENT" && !value.status) {
            var notificationDate = new Date(value.createdDate);
            return notificationDate.setHours(0, 0, 0, 0) === today.getTime();
          }
          return false;
        })
    );

    setUpdatedNotifications((prev) =>
      data2?.data
        .filter((value: any) => value.notificationType !== "FRIEND")
        .map((value: any) => value.id)
    );
  }, [data2]);
  useEffect(() => {
    if (notificationsLike) {
      const tempMap = new Map<string, any[]>();
      notificationsLike.forEach((element: any) => {
        const existingData = tempMap.get(element.link);
        if (existingData) {
          tempMap.get(element.link)?.push(element);
        } else {
          tempMap.set(element.link, [element]);
        }
      });
      setNotificationsLikePost(tempMap);
    }
  }, [notificationsLike]);

  useEffect(() => {
    if (notificationsTag) {
      const tempMap = new Map<string, any[]>();
      notificationsTag.forEach((element: any) => {
        const existingData = tempMap.get(element.link);
        if (existingData) {
          tempMap.get(element.link)?.push(element);
        } else {
          tempMap.set(element.link, [element]);
        }
      });
      setNotificationsTagPost(tempMap);
    }
  }, [notificationsTag]);

  useEffect(() => {
    if (notificationsComment) {
      const tempMap = new Map<string, any[]>();
      notificationsComment.forEach((element: any) => {
        const existingData = tempMap.get(element.link);
        if (existingData) {
          tempMap.get(element.link)?.push(element);
        } else {
          tempMap.set(element.link, [element]);
        }
      });
      setNotificationsCommentPost(tempMap);
    }
  }, [notificationsComment]);

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
              {NotificationTab.POST_INTERACT}
            </Title>
            <>
              <AnimatePresence mode="popLayout">
                {notificationsLikePost &&
                  Array.from(notificationsLikePost.keys()).map(
                    (key: string, index: any) =>
                      notificationsLikePost && (
                        <NotificationPostCard
                          data={
                            notificationsLikePost.get(
                              key
                            ) as NotificationModel[]
                          }
                        />
                      )
                  )}
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                {notificationsTagPost &&
                  Array.from(notificationsTagPost.keys()).map(
                    (key: string, index: any) =>
                      notificationsTagPost && (
                        <NotificationPostCard
                          data={
                            notificationsTagPost.get(key) as NotificationModel[]
                          }
                        />
                      )
                  )}
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                {notificationsCommentPost &&
                  Array.from(notificationsCommentPost.keys()).map(
                    (key: string, index: any) =>
                      notificationsCommentPost && (
                        <NotificationPostCard
                          data={
                            notificationsCommentPost.get(
                              key
                            ) as NotificationModel[]
                          }
                        />
                      )
                  )}
              </AnimatePresence>
            </>
          </Content>

          <Content style={{ background: "#fff", padding: "20px" }}>
            <Title level={5} className="ml-1">
              {NotificationTab.INTERACT}
            </Title>
            <>
              <AnimatePresence mode="popLayout">
                {notificationsToday &&
                  notificationsToday.map((item: any, index: number) => {
                    return (
                      !item.status && (
                        <NotificationCard key={index} data={item} />
                      )
                    );
                  })}
              </AnimatePresence>
            </>
          </Content>

          <Content style={{ background: "#fff", padding: "20px" }}>
            <Title level={5} className="ml-1">
              {NotificationTab.FRIEND}
            </Title>
            <>
              <AnimatePresence mode="popLayout">
                {notificationsTypeFriend &&
                  notificationsTypeFriend.map((item: any, index: number) => {
                    return (
                      !item.status && (
                        <NotificationCard key={index} data={item} />
                      )
                    );
                  })}
              </AnimatePresence>
            </>
          </Content>
          <Content style={{ background: "#fff", padding: "20px" }}>
            <Title level={5} className="ml-1">
              {NotificationTab.POST}
            </Title>
            <>
              <AnimatePresence mode="popLayout">
                {notificationsTypeNormal &&
                  notificationsTypeNormal.map((item: any, index: number) => {
                    return <NotificationCard key={index} data={item} />;
                  })}
              </AnimatePresence>
            </>
          </Content>
        </>
      )}
    </Layout>
  );
}
