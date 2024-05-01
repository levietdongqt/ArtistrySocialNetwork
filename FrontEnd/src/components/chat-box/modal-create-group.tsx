import {Avatar, Search} from "@chatscope/chat-ui-kit-react";
import React, {useEffect, useState} from "react";
import {MyResponse} from "@models/responseObject";
import {ConversationDto, ConversationMember} from "@models/conversation";
import {findFriend} from "../../services/main/clientRequest/friendsClient";
import Link from "next/link";
import {User} from "@models/user";
import {useUser} from "../../context/user-context";
import {CustomIcon} from "@components/ui/custom-icon";
import {Tooltip} from "antd";
import {toast} from "react-toastify";
import {createGroup, sendUpdateConversation} from "../../services/realtime/clientRequest/conversationClient";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";

interface props {
    conversation: ConversationDto;
    closeModal: () => void;
}

export function CreateGroupChat({conversation, closeModal}: props) {
    const [friends, setFriends] = useState<User[]>([])
    const [removeIndex, setRemoveIndex] = useState(-1)
    const [groupName, setGroupName] = useState(conversation.name || 'No name')
    const [isModifyGroupName, setIsModifyGroupName] = useState(false)
    const [members, setMembers] = useState<ConversationMember[]>(conversation.members)
    const [searchString, setSearchString] = useState('')

    const isGroup = conversation.type === "GROUP"
    const {currentUser} = useUser()
    const {state: {pickedConversations, showChatBoxes}, dispatch} = useChat()

    useEffect(() => {
        if (!isGroup) {
            const newMember = [...members]
            newMember.forEach(member => {
                if (member.id === currentUser?.id)
                    member.isGroupOwner = true;
                member.notSeen = false
                member.nickname = member.fullName || member.nickname
            })
            const newGroupName = newMember.reduce((previousValue, currentValue) => {
                return `${previousValue}${previousValue ? ", " : ""}${currentValue.fullName?.split(" ").reverse()[0]}`
            }, '')
            setGroupName(newGroupName)
        }
    }, []);
    const onClearSearch = () => {
        setFriends([])
    }

    let timeoutId: string | number | NodeJS.Timeout | undefined;
    const onChangeSearch = async (search: string) => {
        const callback = async (search: string) => {
            if (search === "") {
                setFriends([])
                return;
            }
            const response: MyResponse<User[]> = await findFriend(search)
            console.log("FRIENDS: ", response.data)
            setFriends(response.data)
            setSearchString(search)

        }
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            callback(search)
        }, 700)
        // console.log("onsubmitSearch", search)
        // const response = await findFriend("Le")
        // console.log("GET FRIEND: ", response)
    }

    const onPickedFriend = (friend: User) => {
        if (members.find(member => member.id === friend.id)) {
            return;
        }
        const newMember: ConversationMember = {
            id: friend.id,
            nickname: friend.fullName,
            fullName: friend.fullName,
            avatar: friend.avatar,
            notSeen: false
        }
        setMembers([...members, newMember])
    }

    const onClickRemove = (index: number) => {
        const newMember = [...members]
        newMember.splice(index, 1)
        setMembers(newMember)
    }

    const handleSubmit = () => {
        console.log("ON CHANG GROUP: ", members)
        if (members.length < 3) {
            toast.warning("Nhóm phải có hơn 2 thành viên!")
            return
        }
        if (groupName.length < 3) {
            toast.warning("Tên nhóm phải trên 3 kí tự!")
            return
        }
        if (groupName.length > 50) {
            toast.warning("Tên nhóm phải ít hơn 50 kí tự!")
            return
        }
        if (!isGroup) {
            const newConversation = {
                name: groupName,
                type: "GROUP",
                members: members,
            }
            toast.promise(createGroup(newConversation), {
                pending: 'Đang tạo nhóm...',
                success: "Tạo nhóm thành công!",
                error: "Tạo nhóm thất bại!"
            }).then((response: MyResponse<ConversationDto>) => {
                if (response.status === 200) {
                    console.log("CREARE GROUP: ", response)
                    const newPicked = [response.data, ...pickedConversations].slice(0, 3)
                    const newShowChatBox = [true, ...showChatBoxes].slice(0, 3)
                    dispatch(ChatAction(response.data, ACTION_TYPE.ADD_CONVERSATION))
                    dispatch(ChatAction(newPicked, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
                    dispatch(ChatAction(newShowChatBox, ACTION_TYPE.SHOW_CHAT_BOXES))
                    closeModal()
                }
            })
            return;
        }
        const newConversation = {
            ...conversation,
            name: groupName,
            members: members,
        }
        toast.promise(sendUpdateConversation({
            ...newConversation,
            memberMap: undefined,
            messages: [],
        }), {
            pending: 'Đang cập nhật nhóm...',
            success: "Cập nhật thành thành công!",
            error: "Cập nhật thất bại!"
        }).then(() => {
            const indexPicked = pickedConversations.findIndex(conversation => conversation?.id === newConversation.id);
            const newPicked = [...pickedConversations]
            newPicked[indexPicked] = newConversation
            dispatch(ChatAction(newPicked, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
            closeModal()
        })
    }

    return <div className={""}>

        <div className="flex items-center justify-center mb-5">
            <div>
                <h6 className="text-black text-xl font-bold">
                    Tên nhóm:
                </h6>
            </div>
            <div className="flex items-center mr-5">
                {
                    (isModifyGroupName || !groupName) ?
                        <div className="ml-4 mt-1 relative w-full ">
                            <input
                                autoFocus={true}
                                type="text" id="fullName" name="fullName"
                                className="border-2 px-3 py-1 placeholder-gray-400 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                value={groupName}
                                placeholder={"Đặt tên nhóm"}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            {/*{errors.fullName && touched.fullName ?*/}
                            {/*    <div className="text-red-700 text-sm ">{errors.fullName}</div> : null}*/}
                        </div>
                        :
                        <div className='ml-4'>
                            <p className={"text-sm"}>{groupName || "GROUP"}</p>
                        </div>
                }
            </div>
            {
                (!isModifyGroupName) && <Tooltip title={"Chỉnh sửa"}>
                    <button
                        className="text-slate-500 text-sm font-bold"
                        onClick={() => {
                            setIsModifyGroupName(true)
                            setGroupName(groupName)
                        }}
                    >
                        <CustomIcon iconName={'IconBxsPencil'}/>
                    </button>
                </Tooltip>
            }
        </div>

        <div className="flex text-center mb-3">
            <div className="flex items-center text-center  w-[90%] h-full">
                {
                    members.filter(member => member.id !== currentUser?.id)
                        .map((member, index) => {
                            return <div className={'px-2 items-center'} key={index}>
                                <Tooltip
                                    title={member.fullName || member.nickname}
                                    placement="top"
                                    onOpenChange={(isOpen) => {
                                        setRemoveIndex(isOpen ? index : -1)
                                        console.log("Remove")
                                    }}
                                >
                                    <div className="relative z-20">
                                        <Avatar
                                            name={member.fullName}
                                            size="md"
                                            src={member.avatar ?? "/images/avatar.png"}
                                        />
                                        {removeIndex === index && (
                                            <div
                                                className="absolute top-0 right-0 transform translate-x-4 -translate-y-5">
                                                <button className="relative overflow-hidden"
                                                        onClick={() => onClickRemove(index)}>
                                    <span
                                        className="block w-full  bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50"></span>
                                                    <CustomIcon iconName="CloseOIcon"/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Tooltip>
                            </div>
                        })
                }
            </div>

            <div className="flex items-center">
                <Tooltip title={isGroup ? 'Cập nhật' : 'Tạo nhóm'}>
                    <button
                        onClick={handleSubmit}
                        className="text-slate-500 text-sm font-bold"
                    >
                        <CustomIcon className={'w-8 h-8'} iconName={'IconSendCheck'}/>
                    </button>
                </Tooltip>
            </div>
        </div>

        <div
            className="my-2  flex items-center before:mt-0.5 before:flex-1 before:border-t-2 before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t-2 after:border-neutral-300">
        </div>

        <Search placeholder="Tìm kiếm bạn bè..."
            // onFocus={() => setIsSearching(true)}
                onChange={onChangeSearch}
                onClearClick={onClearSearch}
                style={{marginBottom: '5px'}}
        />
        {
            friends.length !== 0 ?
                friends.map((friend, index) => {
                    return (
                        <Link key={index}
                              href={"#"}
                              onClick={() => onPickedFriend(friend)}
                              className='accent-tab bg-w-primary rounded-md hover-animation flex px-4
                       py-2 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5 w-full'
                        >
                            <div className="flex items-center justify-between ml-5 w-full">
                                <div className="flex items-center">
                                    <Avatar
                                        name={friend.fullName}
                                        src={friend.avatar}
                                    />
                                    <div className='flex flex-col ml-3 pl-2'>
                                        <p>{friend.fullName}</p>
                                    </div>
                                </div>
                            </div>

                        </Link>
                    )
                })
                :
                <>
                    {searchString && <div className={"text-center mt-5"}>Không tìm thấy bạn bè</div>}
                </>
        }

    </div>;
}
