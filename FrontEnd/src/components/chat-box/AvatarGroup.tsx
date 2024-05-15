import {ConversationMember} from "@models/conversation";
import React from "react";
import {Avatar, Tooltip} from "antd";
import {AvatarSize} from "antd/lib/avatar/AvatarContext";

interface props {
    members: ConversationMember[],
    onClick?: () => void,
    size?: AvatarSize
}

export default function MyAvatarGroup({members, size, onClick: callback}: props) {
    return <>
        <Avatar.Group size={size ?? "large"} maxCount={1} style={{}} maxStyle={{
            color: '#f56a00',
            backgroundColor: '#fde3cf',
        }}>
            <Avatar onClick={() => callback?.()}
                    src={members[0].avatar || "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"}
            />
            {

                members.slice(1).map((member, index) => {
                    return <Tooltip title={member.nickname} placement="top">
                        <Avatar onClick={() => callback?.()}
                                style={{
                                    backgroundColor: '#87d068',
                                }}
                                key={index}
                                src={member.avatar || "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"}
                        />
                    </Tooltip>
                })
            }
        </Avatar.Group>
    </>
}