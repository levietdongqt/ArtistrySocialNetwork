import {ConversationMember} from "@models/conversation";
import {Avatar, AvatarGroup} from "@chatscope/chat-ui-kit-react";
import React from "react";

interface props {
    members: ConversationMember[],
    onClick?: () => void,
}

export default function MyAvatarGroup({members, onClick: callback}: props) {
    return <>
        <AvatarGroup  onClick={() => callback?.()} size={"md"} hoverToFront={true} style={{
            display: 'flex', flexDirection: 'row'
        }}>
            {
                members.slice(0, 2).map((member, index) => {
                    return <Avatar key={index}
                                   title={member.fullName ? member.fullName : ""}
                                   name={member.nickname}
                                   src={member.avatar || "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"}
                                   status={member.status}
                    />
                })
            }
        </AvatarGroup>
    </>
}