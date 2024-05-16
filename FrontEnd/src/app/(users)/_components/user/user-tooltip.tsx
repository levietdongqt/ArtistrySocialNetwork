"use client";
import Link from "next/link";
import cn from "clsx";
import {useWindow} from "../../../../context/window-context";
import {FollowButton} from "@components/ui/follow-button";
import {NextImage} from "@components/ui/next-image";
import {UserAvatar} from "./user-avatar";
import {UserName} from "./user-name";
import {UserFollowing} from "./user-following";
import {UserUsername} from "./user-username";
import React, {ReactNode} from "react";
import {User} from "@models/user";
import {useEffect, useState} from "react";
import {useUser} from "context/user-context";
import HtmlRenderer from "./html-render";
import {Button} from "antd";
import {HeroIcon} from "@components/ui/hero-icon";
import {ToolTip} from "@components/ui/tooltip";
import {openConversationWithAnyone} from "@components/chat-box/chat-box-helper";
import {useChat} from "../../../../context/chat-context";

type UserTooltipProps = Pick<
    User,
    "id" | "bio" | "fullName" | "verified" | "avatar" | "coverImage"
> & {
    modal?: boolean;
    avatarCheck?: boolean;
    children: ReactNode;
    comment?: boolean;
};

type Stats = [string, string, number];

export function UserTooltip({
                                comment,
                                id,
                                bio,
                                fullName,
                                modal,
                                avatar,
                                verified,
                                children,
                                coverImage,
                                avatarCheck,
                            }: UserTooltipProps): JSX.Element {
    const parser = new DOMParser();
    const {isMobile} = useWindow();
    const [hovered, setHovered] = useState(false);
    const [doc, setDoc] = useState<any>();
    const userLink = `/profile/${id}`;
    const {currentUser} = useUser();
    const {state,dispatch} = useChat()
    useEffect(() => {
        setDoc(parser.parseFromString(bio as string, "text/html"));
    }, [bio]);
    const handleMouseEnter = () => {
        if (currentUser?.id !== id) {
            setHovered(true);
        }
    };
    const handleMouseLeave = () => setHovered(false);
    const allStats: Readonly<Stats[]> = [
        ["following", "Following", 2],
        ["followers", "Followers", 2],
    ];
    const sendRequestOpenChat = () => {
        const friend = {
            id: id,
            fullName: fullName,
            nickname: fullName,
            avatar: avatar,
        }
        console.log("onRequestChat")
        openConversationWithAnyone(currentUser!, friend, state, dispatch)
    }
    return (
        <div
            className={cn(
                "group relative self-start text-light-primary dark:text-dark-primary",
                avatarCheck ? "[&>div]:translate-y-2" : "grid [&>div]:translate-y-7"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <div
                className={cn(
                    `menu-container invisible absolute left-1/2 w-72 -translate-x-1/2 rounded-2xl 
                   opacity-0 [transition:visibility_0ms_ease_400ms,opacity_200ms_ease_200ms] group-hover:visible 
                   group-hover:opacity-100 group-hover:delay-500`,
                    comment ? "left-[13.25rem] top-[-12.5rem] z-50 " : ""
                )}
            >
                <div className="flex flex-col gap-3 p-4">
                    <div className="flex flex-col gap-2">
                        <div className="-mx-4 -mt-4">
                            {coverImage ? (
                                <Link href={userLink} className="blur-picture">
                                    <div className="blur-picture">
                                        <NextImage
                                            useSkeleton
                                            className="relative h-24"
                                            imgClassName="rounded-t-2xl"
                                            src={
                                                coverImage ??
                                                "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"
                                            }
                                            alt={fullName}
                                            layout={"fill"}
                                        />
                                    </div>
                                </Link>
                            ) : (
                                <div className="h-16 rounded-t-2xl bg-light-line-reply dark:bg-dark-line-reply"/>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <div className="mb-10">
                                <UserAvatar
                                    className="absolute -translate-y-1/2 bg-main-background p-1
                             hover:brightness-100 [&>figure>span]:[transition:200ms]
                             [&:hover>figure>span]:brightness-75"
                                    src={
                                        avatar ?? "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"
                                    }
                                    alt={fullName}
                                    size={64}
                                    username={fullName}
                                    id={id}
                                />
                            </div>
                            <Button
                                className="dark-bg-tab group relative border border-light-line-reply p-2 z-50 bg-blue-50"
                                onClick={() => sendRequestOpenChat()}
                            >
                                <HeroIcon
                                    className="h-5 w-5 text-dark"
                                    iconName="EnvelopeIcon"
                                />
                            </Button>
                            {hovered && (
                                <FollowButton
                                    userTargetId={id}
                                    userTargetUsername={fullName}
                                    hovered={hovered}
                                />
                            )}
                        </div>
                        <div>
                            <UserName
                                className="-mb-1 text-lg"
                                name={fullName}
                                username={fullName}
                                verified={verified}
                                id={id}
                            />
                            <div className="flex items-center gap-1 text-light-secondary dark:text-dark-secondary">
                                <UserUsername username={fullName} id={id}/>

                                {hovered === true && (
                                    <UserFollowing userTargetId={id} hovered={hovered}/>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-secondary flex gap-4"></div>
                </div>
                {/* {bio && <HtmlRenderer htmlString={bio} />} */}
                <div className="text-secondary flex gap-4"></div>
            </div>
        </div>
    );
}
