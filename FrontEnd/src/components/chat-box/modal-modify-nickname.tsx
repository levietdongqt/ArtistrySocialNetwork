import {ConversationDto} from "@models/conversation";
import {Avatar} from "@chatscope/chat-ui-kit-react";
import React, {useState} from "react";
import {CustomIcon} from "@components/ui/custom-icon";
import {toast} from "react-toastify";
import {Tooltip} from "antd";
import {sendUpdateConversation} from "../../services/realtime/clientRequest/conversationClient";
import {useChat} from "../../context/chat-context";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";

interface props {
    conversation: ConversationDto;
}

export function ModalModifyNickname({conversation}: props) {
    const [modifyIndex, setModifyIndex] = useState(-1)
    const [nickname, setNickname] = useState('')
    const {state: {pickedConversations}, dispatch} = useChat()
    let toastId: any;
    const handleChangeNickname = (value: string) => {
        if (nickname.length < 50) {
            setNickname(value)
            return;
        }
        setNickname(value.substring(0, 50))
        if (toast.isActive(toastId)) return;
        toastId = toast.warning("Nickname tối đa 50 kí tự!")

    }
    const onSubmitChangeNickname = () => {
        if (nickname.length < 3) {
            if (toast.isActive(toastId)) return;
            toastId = toast.warning("Nickname tối thiểu 3 kí tự!")
            return;
        }
        if (nickname.length > 50) {
            if(toast.isActive(toastId))return;
            toastId = toast.warning("Nickname tối đa 50 kí tự!")
            return;
        }
        const updateConversation: ConversationDto = {...conversation}
        updateConversation.members[modifyIndex].nickname = nickname
        toast.promise(sendUpdateConversation(
            {...updateConversation, messages: [], memberMap: undefined}
        ), {
            success: "Cập nhật biệt danh thành công!",
            pending: "Đang cập nhật!"
        })
        const conversationIndex = pickedConversations.findIndex(conversation => conversation?.id === updateConversation.id)
        const newPicked = [...pickedConversations]
        newPicked[conversationIndex] = updateConversation
        dispatch(ChatAction(newPicked, ACTION_TYPE.SET_PICKED_CONVERSATIONS))
        setModifyIndex(-1)
    }
    return <>
        <div className="text-center mb-3">
            <h6 className="text-black text-2xl font-bold">
                Biệt danh
            </h6>
        </div>
        <div
            className="my-2  flex items-center before:mt-0.5 before:flex-1 before:border-t-2 before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t-2 after:border-neutral-300">
            {/*<p className="mx-4 mb-0 text-center font-medium dark:text-neutral-100">*/}
            {/*</p>*/}
        </div>
        {
            conversation.members.map((member, index) => {
                return (
                    <div className="flex text-slate-500 items-center justify-between my-5 w-full" key={index}>
                        <div className="flex items-center">
                            <Avatar
                                content={"HELO"}
                                name={member.nickname}
                                src={member.avatar}
                            />
                            {
                                modifyIndex === index ?
                                    <div className="ml-4 mt-1 relative w-full ">
                                        <input
                                            autoFocus={true}
                                            type="text" id="fullName" name="fullName"
                                            className="border-0 px-3 py-2 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            value={nickname}
                                            onChange={(e) => handleChangeNickname(e.target.value)}
                                        />
                                        {/*{errors.fullName && touched.fullName ?*/}
                                        {/*    <div className="text-red-700 text-sm ">{errors.fullName}</div> : null}*/}
                                    </div>
                                    :
                                    <div className='ml-4 flex flex-col'>
                                        <p className={"text-md text-black"}>{member.nickname}</p>
                                        <p className={"text-sm"}>{member.fullName}</p>
                                    </div>
                            }
                        </div>
                        <div className={"flex items-center mr-5"}>
                            {
                                modifyIndex === index ?
                                    <Tooltip title={"Lưu thay đổi"}>
                                        <button
                                            className="text-slate-500 text-sm font-bold"
                                            onClick={onSubmitChangeNickname}
                                        >
                                            <CustomIcon iconName={'IconSendCheck'}/>
                                        </button>
                                    </Tooltip>
                                    :
                                    <Tooltip title={"Chỉnh sửa"}>
                                        <button
                                            className="text-slate-500 text-sm font-bold"
                                            onClick={() => {
                                                setModifyIndex(index)
                                                setNickname(member.nickname)
                                            }}
                                        >
                                            <CustomIcon iconName={'IconBxsPencil'}/>
                                        </button>
                                    </Tooltip>
                            }
                        </div>
                    </div>
                )
            })
        }
    </>;
}