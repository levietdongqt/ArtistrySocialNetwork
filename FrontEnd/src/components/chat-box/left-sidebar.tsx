import {
    Avatar,
    Conversation,
    ConversationHeader,
    ConversationList,
    ExpansionPanel,
    Search,
    Sidebar
} from "@chatscope/chat-ui-kit-react";
import React from "react";
import {CustomIcon} from "@components/ui/custom-icon";

interface LeftSidebarProps {
    closeLeftSideBar?: () => void; // The callback prop is an optional function
}

export function LeftSidebar({closeLeftSideBar}: LeftSidebarProps) {
    const handleCloseLeftSideBar = () => {
        closeLeftSideBar?.();
    }
    return (
        <>

            <Sidebar
                position="left"
            >
                <div className={'flex items-center'}>
                    <Search placeholder="Search..."/>
                    <button onClick={handleCloseLeftSideBar}>
                        <CustomIcon iconName={"CloseIcon"}/>
                    </button>
                </div>

                <ConversationList loading={false}>
                    <Conversation
                        info="Yes i can do it for you"
                        lastSenderName="Lilly"
                        name="Lilly"
                    >
                        <Avatar
                            name="Lilly"
                            src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"
                            status="available"
                        />
                    </Conversation>
                    <Conversation
                        info="Yes i can do it for you"
                        lastSenderName="Patrik"
                        name="Patrik"
                    >
                        <Avatar
                            name="Patrik"
                            src="https://chatscope.io/storybook/react/assets/patrik-yC7svbAR.svg"
                            status="invisible"
                        />
                    </Conversation>
                </ConversationList>
            </Sidebar>
        </>

    )
}