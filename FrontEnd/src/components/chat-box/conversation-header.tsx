import {Avatar, AvatarGroup, ConversationHeader, InfoButton, MainContainer} from "@chatscope/chat-ui-kit-react";
import React from "react";
import {ConversationDto, ConversationMember} from "../../models/conversation";
import {MyTooltip} from "@components/ui/my-tooltip";
import {CustomIcon} from "@components/ui/custom-icon";
import {usePathname} from "next/navigation";
import {Dropdown, MenuProps} from "antd";
import Link from "next/link";
import {ConversationHeaderDropdown} from "@components/chat-box/conversation-header-dropdown";
import MyAvatarGroup from "@components/chat-box/AvatarGroup";

interface ConversationHeaderProps {
    conversation: ConversationDto,
    otherMembers: ConversationMember[] | undefined,
    onClickCloseMessage: () => void,
    onClickMinusChatBox: (status: boolean) => void
}

export default function MyConversationHeader({
                                                 conversation,
                                                 otherMembers,
                                                 onClickCloseMessage,
                                                 onClickMinusChatBox
                                             }: ConversationHeaderProps) {
    const isInMessagePage = usePathname() === "/message"
    return (
        <ConversationHeader>
            {
                <div is={"AvatarGroup"} className={""}>
                    <MyAvatarGroup members={otherMembers!}/>
                </div>
            }
            <ConversationHeader.Content
                title={conversation.name || otherMembers![0].nickname}
                info="Active 10 mins ago"
                userName={conversation.name || otherMembers![0].nickname}
            />
            <ConversationHeader.Actions>
                <ConversationHeaderDropdown
                    conversation={conversation}
                    otherMembers={otherMembers!}
                    isInMessage={isInMessagePage}
                    isGroup={otherMembers?.length! > 1}/>
                {
                    !isInMessagePage &&
                    <>
                        <MyTooltip content={"Thu nhỏ"}>
                            <button className="relative overflow-hidden"
                                    onClick={() => onClickMinusChatBox(false)}
                            >
                            <span
                                className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                            </span>
                                <CustomIcon iconName={"MinusIcon"}/>
                            </button>
                        </MyTooltip>
                        <MyTooltip content={"Đóng"}>
                            <button className="relative overflow-hidden" onClick={onClickCloseMessage}>
                                <span
                                    className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                                </span>
                                <CustomIcon iconName={"CloseMessage"}/>
                            </button>
                        </MyTooltip>
                    </>
                }
            </ConversationHeader.Actions>
        </ConversationHeader>
    )
}