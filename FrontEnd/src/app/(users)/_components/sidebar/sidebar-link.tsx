import { usePathname } from "next/navigation";
import Link from "next/link";
import cn from "clsx";
import { preventBubbling } from "@lib/utils";
import { HeroIcon } from "@components/ui/hero-icon";
import type { NavLink } from "./sidebar";
import useSWR, { mutate } from "swr";
import {
  countUnreadNotifications,
  updateDeliveryNotification,
} from "services/main/clientRequest/notificationsClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { Loading } from "@components/ui/loading";
import { Error } from "@components/ui/error";
import { useEffect, useState } from "react";
import { useUser } from "context/user-context";
import { useSocket } from "context/websocket-context1";
import { notification } from "antd";
import { postNotificationsAPI } from "services/realtime/realtimeservice";

type SidebarLinkProps = NavLink & {
  username?: string;
};

export function SidebarLink({
  href,
  username,
  iconName,
  linkName,
  disabled,
  canBeHidden,
}: SidebarLinkProps) {
  var user = useUser();
  const [countNoti, setCountNoti] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [shouldFetchNotification, setShouldFetchNotification] = useState(true);
  const asPath = usePathname();
  const isActive = username ? asPath.includes(username) : asPath === href;
  const { notificationMessages, setNotificationMessages } = useSocket();
  //Xu lý show notifications
  const {
    data: notificationsData,
    isLoading: isLoading,
    error: error2,
  } = useSWR(
    shouldFetchNotification
      ? countUnreadNotifications(user.currentUser?.id as string)
      : null,
    fetcherWithToken
  );

  useEffect(() => {
    setShouldFetchNotification(true);
    setNotificationMessages(null);
    if (notificationsData && notificationMessages != null) {
      setCountNoti(notificationsData.data); 
    }
  }, [notificationMessages]);

  useEffect(() => {
    if (shouldFetchNotification) {
      setShouldFetchNotification(false);
    }
  }, [shouldFetchNotification]);

  //Xử lý update delivery
  const {} = useSWR(
    shouldFetch
      ? updateDeliveryNotification(user.currentUser?.id as string)
      : null,
    fetcherWithToken
  );

  function handleClickSlidebar() {
    //disabled ? preventBubbling() : undefined;
    if (!disabled) {
      setShouldFetch(true);
      setCountNoti(0);
    }
    // setShouldFetch(true);
    // 
  }
  useEffect(() => {
    if (shouldFetch) {
      setShouldFetch(false);
    }
  }, [shouldFetch]);
  return (
    <Link
      href={href}
      className={cn(
        "group py-1 outline-none",
        canBeHidden ? "hidden xs:flex" : "flex",
        disabled && "cursor-not-allowed"
      )}
      onClick={handleClickSlidebar}
    >
      <div
        className={cn(
          `custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition 
             duration-200 group-hover:bg-light-primary/10 group-focus-visible:ring-2 
             group-focus-visible:ring-[#878a8c] dark:group-hover:bg-dark-primary/10 
             dark:group-focus-visible:ring-white xs:p-3 xl:pr-5`,
          isActive && "font-bold"
        )}
      >
        <div className="relative">
          {" "}
          {/* Tạo một container để chứa số nhỏ */}
          <HeroIcon
            className={cn(
              "h-7 w-7",
              isActive &&
                ["Explore", "Lists"].includes(linkName) &&
                "stroke-white"
            )}
            iconName={iconName}
            solid={isActive}
          />
          {linkName === "Thông báo" && isLoading? (
            
            <Loading className="mt-5" />
          ) : (
            
            linkName === "Thông báo" &&
            countNoti != 0 && (
              <span className="absolute top-0 left-0 bg-blue-500 text-white rounded-full px-1 py-0.5 text-xs">
                {countNoti}
              </span>
            )
          )}
        </div>
        <p className="hidden xl:block">{linkName}</p>
      </div>
    </Link>
  );
}
