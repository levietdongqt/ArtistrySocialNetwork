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
import { Row, Col, Card } from 'antd';
import { User } from '@models/user';
import { formatElapsedTime } from '@lib/helper/convertTime';

const { Text } = Typography;
interface SearchServiceParams {
    data: SearchService,
}
type SearchService = {
  id: number;
  name: string;
  price: number;
  priceType: string;
  duration: number;
  restTime: number;  
  imageUrls : [];
  description : string;
  createBy : string;
  createDate : string;
  extraServiceDTOs: any;
  promotionDTO: any;
  provider :User;
} 


export function SearchServiceCard({data} : SearchServiceParams): JSX.Element {
  console.log("data",data)
  var currentDate = new Date();
  var specificDate = new Date(data.createDate);
  var timeDifference = currentDate.getTime() - specificDate.getTime();
  var timeDifferenceInSeconds = formatElapsedTime(timeDifference);
  return (
    <div  className='hover-animation grid hover:bg-light-primary/5 dark:hover:bg-dark-primary/5'>
    <Link href={`/user/dgfdg`}  className='accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4
                   py-3'
    >
       <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
    
      <UserTooltip avatarCheck {...data.provider}>
      <Avatar
          src={"https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
          alt={"name"}
          size={40}
        />
        </UserTooltip>
        <div className='flex flex-col'>
            <Text strong>{data.name}</Text>
            <span>{timeDifferenceInSeconds}</span>
            <Text strong>Price: {data.price}</Text>
            <Text >{data.description}</Text>    
        </div>
      </div>
      
      </div>
      
    </Link>
    <Row className='ml-20'>
  {data.imageUrls && data.imageUrls.map((image, index) => (
    <Col key={index} span={10}>
      <Card hoverable cover={<img alt={image} src={image}/>}/>
    </Col>
  ))}
</Row>
  </div>
  );
}
