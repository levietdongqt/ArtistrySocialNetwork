import Link from "next/link";
import {ConversationMember} from "@models/conversation";
import {Typography} from "antd";
import {UserTooltip} from "../../app/(users)/_components/user/user-tooltip";
import {UserAvatar} from "../../app/(users)/_components/user/user-avatar";
import {UserUsername} from "../../app/(users)/_components/user/user-username";
import {UserName} from "../../app/(users)/_components/user/user-name";

const {Text} = Typography;

interface SearchUserParams {
    data: ConversationMember,
}


export function SearchUserCard({data}: SearchUserParams): JSX.Element {

    return (
        <Link href={`/user/${data.id}`} className='accent-tab bg-w-primary  hover-animation grid grid-cols-[auto,1fr] gap-3 px-4
                   py-2 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5 w-full'
        >
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <UserAvatar
                        src={data.avatar || "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
                        alt={"name"}
                        username={`${data.fullName}`}
                    />
                    <div className='flex flex-col pl-2'>
                        <UserName
                            className='-mb-1 text-sm'
                            name={data.fullName}
                            username={data.fullName}
                            verified={false}
                        />
                    </div>
                </div>
            </div>
        </Link>

    );
}