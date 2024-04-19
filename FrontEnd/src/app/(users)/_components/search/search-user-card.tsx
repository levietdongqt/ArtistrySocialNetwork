import Link from 'next/link';
import { UserAvatar } from '../user/user-avatar';
import { Typography,Button, Avatar } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import { FollowButton } from '@components/ui/follow-button';
import { UserTooltip } from '../user/user-tooltip';
import useSWR from 'swr';
import { getUserSearch } from 'services/main/clientRequest/searchClient';
import { useUser } from 'context/user-context';
import { useSearch } from 'context/search-context';
import { fetcherWithToken } from '@lib/config/SwrFetcherConfig';
import { UserUsername } from '../user/user-username';

const { Text } = Typography;
interface SearchUserParams {
    data: SearchUser,
}
type SearchUser = {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  roles: [];
  friendShipStatus: string;  
  bio : string;
  modal : boolean;
  verified : boolean;
  coverImage : string;
} 


export function SearchUserCard({data} : SearchUserParams): JSX.Element {
  
  return (
    <Link href={`/user/${data.id}`}  className='accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4
                   py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5'
    >
       <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
    
      <UserTooltip avatarCheck {...data}>
      <Avatar
          src={"https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
          alt={"name"}
          size={40}
        />
        </UserTooltip>
        <div className='flex flex-col'>
            <Text strong>{data.fullName}</Text>
            <UserUsername username={data.fullName} />    
        </div>
      </div>
      <div className="absolute right-10"> 
        {
            data.friendShipStatus === "UNFRIEND" && (
                <Button type="primary" style={{ backgroundColor:"GREY" }}>Kết bạn</Button>
            )
        }
        {
            data.friendShipStatus === "ISFRIEND" && (
                <Text>Đã là bạn bè</Text>
            )
        }
        </div>
      </div>
    </Link>
  );
}
