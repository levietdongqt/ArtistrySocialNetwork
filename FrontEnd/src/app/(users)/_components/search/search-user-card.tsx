import Link from 'next/link';
import { UserAvatar } from '../user/user-avatar';
import { Typography,Badge } from "antd";
import { UserTooltip } from '../user/user-tooltip';
import { UserUsername } from '../user/user-username';
import { SearchUser } from '@models/search';
import { SearchButton } from './search-button';
import { UserName } from '../user/user-name';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;
interface SearchUserParams {
    data: SearchUser,
}



export function SearchUserCard({data} : SearchUserParams): JSX.Element {
  
  return (
    <Link href={`/user/${data.user.id}`}  className='accent-tab bg-w-primary py-5 hover-animation grid grid-cols-[auto,1fr] gap-3 px-4
                   py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5'
    >
       <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
    
      <UserTooltip avatarCheck={true} {...data.user}>
      <UserAvatar
            src={data.user.avatar || "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
            alt={"name"}
            username={`${data?.user.id}`}
          />
        </UserTooltip>
        <div className='flex flex-col'>
        <UserName
                className='-mb-1 text-lg'
                name={data.user.fullName}
                username={data.user.fullName}
                verified={data.user.verified}
                id={data.user.id}
              />
            <UserUsername username={data.user.fullName} id={data.user.id} />    
        </div>
      </div>
      <div className='absolute right-5'>
      <SearchButton userTargetUsername={data.user.fullName} userTargetId={data.user.id} follow={data.isCheckFriend.follow} pending={data.isCheckFriend.pending} friend={data.isCheckFriend.friend} acceptedFriend={data.isCheckFriend.acceptFriend} />
      </div>
      </div>
    </Link>
    
  );
}
