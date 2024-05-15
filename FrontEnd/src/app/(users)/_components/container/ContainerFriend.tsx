'use client'
import React, {useEffect} from 'react';
import {Loading} from "@components/ui/loading";
import {motion} from "framer-motion";
import {variants} from "../aside/aside-trends";
import {UserCard} from "../user/user-card";
import {MainHeader} from "../home/main-header";
import {useRouter} from "next/navigation";
import {useUser} from "../../../../context/user-context";
import useSWR from "swr";
import {getFriendByUserId} from "../../../../services/main/clientRequest/friendsClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {Error} from "@components/ui/error";
import {FriendHomeLayout} from "../friend/friendHomeLayout";
import cn from "clsx";
import {useRecoilState} from "recoil";
import {mutateFriend} from "@lib/hooks/mutateFriend";
import {StatsEmpty} from "../content/stats-empty";

const ContainerFriend = () => {
    const {currentUser} = useUser();
    const [,setMutateFriends] = useRecoilState(mutateFriend);
    const userId = currentUser?.id as string;
    const { data:friends, isLoading,mutate  } = useSWR(getFriendByUserId(userId),fetcherWithToken );
    useEffect(() => {
        setMutateFriends(()=>mutate);
    }, [mutate,setMutateFriends]);
    return (
        <>
            <section>
                {isLoading ? (
                    <Loading className='mt-5' />
                ) : !friends?.data ? (
                        <Error message='Không co dữ liệu' />
                    ) : friends?.data.length === 0 ?
                    (
                        <StatsEmpty
                            title='Không có bạn bè nào'
                            imageData={{ src:'/no-followers.png', alt: 'No friends' }}
                        />
                    )
                    : (
                        <>
                            <motion.div className='mt-0.5' {...variants}>
                                {friends?.data.map((userData:any) => (
                            <UserCard {...userData} key={userData.id} follow friends />
                             ))}
                        </motion.div>
                        {/*<LoadMore />*/}
                    </>
                )}
            </section>
        </>

    );
};

export default ContainerFriend;