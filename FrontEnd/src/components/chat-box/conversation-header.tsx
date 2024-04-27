import {Avatar, AvatarGroup, ConversationHeader, InfoButton, MainContainer} from "@chatscope/chat-ui-kit-react";
import React from "react";
import {ConversationMember} from "../../models/conversation";
import {MyTooltip} from "@components/ui/my-tooltip";
import {CustomIcon} from "@components/ui/custom-icon";

interface ConversationHeaderProps {
    otherMembers: ConversationMember[] | undefined,
    onClickCloseMessage: () => void,
    onClickMinusChatBox: (status: boolean) => void
}

export default function MyConversationHeader({otherMembers,onClickCloseMessage,onClickMinusChatBox}: ConversationHeaderProps) {

    return (
        <ConversationHeader>
            {
                otherMembers?.length === 1 ?
                    <Avatar
                        name={otherMembers[0].nickname}
                        src={otherMembers[0].avatar}
                    />
                    :
                    <AvatarGroup size={"md"} hoverToFront={true} style={{
                        display: 'flex', flexDirection: 'row'
                    }}>
                        <div is={"Avatar"}>
                            <Avatar
                                name={"Nhóm"}
                                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                            />
                        </div>
                        <div is={"Avatar"}>
                            <Avatar
                                name={"Nhóm"}
                                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                            />
                        </div>
                    </AvatarGroup>
            }
            <ConversationHeader.Content
                title={"HELLO"}
                info="Active 10 mins ago"
                userName={"HELO"}
            />
            <ConversationHeader.Actions>
                <MyTooltip content={"Thêm"}>
                    <button className="relative overflow-hidden">
                            <span
                                className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                            </span>
                        <InfoButton/>
                    </button>
                </MyTooltip>
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
            </ConversationHeader.Actions>
        </ConversationHeader>
    )
}