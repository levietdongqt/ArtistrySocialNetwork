import Link from "next/link";
import {ConversationDto} from "@models/conversation";
import {Typography} from "antd";
import {useUser} from "../../context/user-context";
import React, {useState} from "react";
import {Avatar} from "@chatscope/chat-ui-kit-react";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";

const {Text} = Typography;

interface SearchUserParams {
    conversation: ConversationDto,
    onPickConversation: (currentConversation: ConversationDto) => void,
}


export function SearchUserCard({conversation, onPickConversation}: SearchUserParams): JSX.Element {
    const {currentUser} = useUser()
    const {dispatch} = useChat()
    const [otherMembers, setOtherMembers] = useState(conversation.members.filter(member => member.id !== currentUser?.id))
    const onClickFriend = () => {
        onPickConversation(conversation)
        dispatch(ChatAction(conversation, ACTION_TYPE.ADD_CONVERSATION))
    }
    let data;
    return (
        <Link href={"#"} onClick={onClickFriend} className='accent-tab bg-w-primary  hover-animation grid grid-cols-[auto,1fr] gap-3 px-4
                   py-2 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5 w-full'
        >
            <div className="flex items-center justify-between ml-5 w-full">
                <div className="flex items-center">
                    {
                        otherMembers.length === 1 ?
                            <>
                                <Avatar
                                    name={otherMembers[0].nickname}
                                    src={otherMembers[0].avatar}
                                />
                                <div className='flex flex-col ml-3 pl-2'>
                                    <p>{otherMembers[0].fullName}</p>
                                </div>
                            </>
                            :
                            <>
                                <h2>IS GROUP</h2>
                            </>
                    }

                </div>
            </div>
        </Link>

    );
}