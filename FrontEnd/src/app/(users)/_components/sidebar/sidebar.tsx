"use client"
import Link from "next/link";
import {useWindow} from "../../../../context/window-context";
import {useModal} from "@lib/hooks/useModal";
import {Modal} from "../modal/modal";
import {Input} from "../input/input";
import {CustomIcon} from "@components/ui/custom-icon";
import {Button} from "@components/ui/button";
import {SidebarLink} from "./sidebar-link";
import {MoreSettings} from "./more-settings";
import {SidebarProfile} from "./sidebar-profile";
import type {IconName} from "@components/ui/hero-icon";
import {testHeader} from "../../../../services/main/auth-service";
import {notification} from "antd";
import {SmileOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {useNotification} from "../../../../context/notification-context";
import {Conversations} from "@components/chat-box/conversations";
import {useChat} from "../../../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import ChatBox from "@components/chat-box/chat-box";
import {useUser} from "../../../../context/user-context";


export type NavLink = {
    href: string;
    linkName: string;
    iconName: IconName;
    disabled?: boolean;
    canBeHidden?: boolean;
    callBack?: () => void;
};

const navLinksTop: Readonly<NavLink[]> = [

    {
        href: '/home',
        linkName: 'Trang chủ',
        iconName: 'HomeIcon'
    },
    {
        href: '/notifications',
        linkName: 'Thông báo',
        iconName: 'BellIcon',
        disabled: false
    }
];
const navLinksBot: Readonly<NavLink[]> = [
    {
        href: '/bookmarks',
        linkName: 'Đã lưu',
        iconName: 'BookmarkIcon',
        canBeHidden: true
    },
    {
        href: '/friends',
        linkName: 'Bạn bè',
        iconName: 'Bars3BottomLeftIcon',
        canBeHidden: true
    }
];

export function Sidebar() {

    const {isMobile} = useWindow();
    const [api, contextHolder] = notification.useNotification();
    const {open, openModal, closeModal} = useModal();
    const {notificationsContent} = useNotification();
    const {state: {showConversations, showChatBoxes, pickedConversations}, dispatch} = useChat()
    useEffect(() => {
        notificationsContent &&
        api.info({
            message: notificationsContent.userTo.fullName,
            description: notificationsContent.message,
            icon: (
                <SmileOutlined
                    style={{
                        color: "#108ee9",
                    }}
                />
            ),
            placement: "topLeft",
            duration: 5,
            style: {
                background: "#fff",
                color: "grey",
                width: "300px",
                borderRadius: 10,
            },
        });
    }, [notificationsContent]);


    const {currentUser} = useUser()
     return (
        <>
            <header
                id="sidebar"
                className="flex w-0 shrink-0 transition-opacity duration-200 xs:w-20 md:w-24
                 lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-xs xl:justify-end"
            >
                <Modal
                    className="flex items-start justify-center"
                    modalClassName="bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden"
                    open={open}
                    closeModal={closeModal}
                >
                    <Input modal closeModal={closeModal}/>
                </Modal>
                <div
                    className="fixed bottom-0 z-10 flex w-full flex-col justify-between border-t border-light-border
                   bg-main-background py-0 dark:border-dark-border xs:top-0 xs:h-full xs:w-auto xs:border-0 
                   xs:bg-transparent xs:px-2 xs:py-3 xs:pt-2 md:px-4 xl:w-72"
                >
                    <section className="flex flex-col justify-center gap-2 xs:items-center xl:items-stretch">
                        <h1 className="hidden xs:flex">
                            <Link
                                href="/"
                                className="custom-button main-tab text-accent-blue transition hover:bg-light-primary/10
                           focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80
                           dark:text-twitter-icon dark:hover:bg-dark-primary/10"
                            >
                                <CustomIcon className="h-7 w-7" iconName="GameIcon"/>
                            </Link>
                        </h1>
                        <nav className="flex items-center justify-around xs:flex-col xs:justify-center xl:block">
                            {navLinksTop.map(({...linkData}) => (
                                <SidebarLink {...linkData} key={linkData.href}/>
                            ))}
                            <SidebarLink
                                href={`/message`}
                                linkName="Tin nhắn"
                                iconName="EnvelopeIcon"
                            />
                            {navLinksBot.map(({...linkData}) => (
                                <SidebarLink {...linkData} key={linkData.href}/>
                            ))}
                            <SidebarLink
                                href={`/profile/${currentUser?.id}`}
                                username={"username"}
                                linkName="Tài khoản"
                                iconName="UserIcon"
                            />
                            {!isMobile && <MoreSettings/>}
                        </nav>
                        <Button
                            className="accent-tab absolute right-4 -translate-y-[72px] bg-main-accent text-lg font-bold text-white
                       outline-none transition hover:brightness-90 active:brightness-75 xs:static xs:translate-y-0
                       xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75 xl:w-11/12"
                        >
                            <CustomIcon
                                className="block h-6 w-6 xl:hidden"
                                iconName="FeatherIcon"
                            />
                            <p className="hidden xl:block">Post</p>
                        </Button>
                    </section>
                    
                    {!isMobile && <SidebarProfile/>}

                </div>

            </header>
            {contextHolder}
        </>
    );
}
