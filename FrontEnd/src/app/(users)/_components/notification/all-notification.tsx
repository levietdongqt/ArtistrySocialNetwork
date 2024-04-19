'use client'
import {Layout} from "antd";
import {UserCard} from "../user/user-card";
import {Typography} from "antd";
import NotificationCard from "./notification-card";
import useSWR from "swr";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {getAllNotifications} from "services/main/clientRequest/notificationsClient";
import {Loading} from "@components/ui/loading";
import {Error} from "@components/ui/error";
import {AnimatePresence} from "framer-motion";
import {useAuth} from "../../../../context/oauth2-context";
import {useUser} from "context/user-context";
import {getCookie, getCookies} from "cookies-next";

const {Sider, Content} = Layout;
const {Title} = Typography;
import {cookies} from "next/headers";
import { useEffect, useRef, useState } from "react";
import { useNotification } from "context/notification-context";

export default function AllNotification() {
    const user = useUser();
    const {notificationsContent} = useNotification();
    const [notificationsTypeFriend,setNotificationsTypeFriend] = useState<any>([])
    const [notificationsTypeNormal,setNotificationsTypeNormal] = useState<any>([])
    const [notificationsToday,setNotificationsToday]= useState<any>([]);
    const {
        data: data2,
        isLoading: isLoading2,
        error: error2,
    } = useSWR(getAllNotifications(user.currentUser?.id as string), fetcherWithToken,{
        revalidateOnFocus: false,
    });

    useEffect(()=>{
        switch(notificationsContent?.notificationType){
            case "FRIEND":
                setNotificationsTypeFriend([notificationsContent,...notificationsTypeFriend])
                break;
            case "NORMAL":
                setNotificationsTypeNormal([notificationsContent,...notificationsTypeNormal])
                break;
            case "TAG" || "LIKE" || "COMMENT" || "FOLLOWING" || "ACCEPT_FRIEND":
                console.log("notificationsTypeFriend",notificationsTypeFriend);
                setNotificationsToday([notificationsContent,...notificationsToday])
                break;
            default:
                break;
        }
    },[notificationsContent])

    useEffect(()=>{
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        setNotificationsTypeFriend(data2 &&
            data2.data.filter((value: any) => value.notificationType === "FRIEND"));
        setNotificationsTypeNormal( data2 &&
            data2.data.filter((value: any) => value.notificationType === "NORMAL"));
        setNotificationsToday(data2 &&
            data2.data.filter((value: any) => {
                    // Lọc ra các thông báo có notificationType là "Like" hoặc "Comment"
                    if (
                        value.notificationType === "LIKE" ||
                        value.notificationType === "COMMENT" || value.notificationType === "TAG" || value.notificationType === "FOLLOWING" || value.notificationType === "ACCEPT_FRIEND"
                    ) {
                        var notificationDate = new Date(value.createdDate);
                       
        
                        return notificationDate.setHours(0, 0, 0, 0) === today.getTime();
                    }
                    return false;
                }))
    },[data2])

    return (
        <Layout>
            {isLoading2 ? (
                <Loading className="mt-5"/>
            ) : !data2.data ? (
                <Error message="Something went wrong"/>
            ) : (
                <>
                    <Content style={{background: "#fff", padding: "20px"}}>
                        <Title level={5} className="ml-1">
                            Tương tác với bạn
                        </Title>
                        <>
                            <AnimatePresence mode="popLayout">
                                {notificationsToday &&
                                    notificationsToday.map((item: any, index: number) => {
                                        return !item.status && <NotificationCard key={index} data={item}/>;
                                    })}
                            </AnimatePresence>
                            {/* <LoadMore />*/}
                        </>
                    </Content>

                    <Content style={{background: "#fff", padding: "20px"}}>
                        <Title level={5} className="ml-1">
                            Lời mời kết bạn
                        </Title>
                        <>
                            <AnimatePresence mode="popLayout">
                                {notificationsTypeFriend &&
                                    notificationsTypeFriend.map((item: any, index: number) => {
                                        return !item.status && <NotificationCard key={index} data={item}/>;
                                    })}
                            </AnimatePresence>
                        </>
                    </Content>
                    <Content style={{background: "#fff", padding: "20px"}}>
                        <Title level={5} className="ml-1">
                            Bài viết khác
                        </Title>
                        <>
                            <AnimatePresence mode="popLayout">
                                {notificationsTypeNormal &&
                                    notificationsTypeNormal.map((item: any, index: number) => {
                                        return <NotificationCard key={index} data={item}/>;
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
