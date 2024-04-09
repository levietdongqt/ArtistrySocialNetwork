'use client'
import {CustomIcon} from "@components/ui/custom-icon";
import {useState} from "react";
import ChatBox from "@components/chat-box/chat-box";
import {LeftSidebar} from "@components/chat-box/left-sidebar";

export function ChatAlert() {
    const [showChatBox, setShowChatBox] = useState(false);
    return (
        <div className="fixed bottom-10 right-5 mb-4 ml-4 p-2 rounded ">
            {showChatBox && (
                <div className={''}>
                    <LeftSidebar closeLeftSideBar={() => setShowChatBox(false)}/>
                </div>
            )}
            <button className="fixed bottom-0 right-5 mb-4 ml-4 p-2  text-white rounded"
                    onClick={() => {
                        setShowChatBox(prevState => !prevState)
                    }}>
                <CustomIcon iconName="MessageIcon"/>
            </button>
        </div>
    )
}