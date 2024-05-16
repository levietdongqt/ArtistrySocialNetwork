'use client'
import React, {useEffect, useState} from 'react';
import {Loading} from "@components/ui/loading";
import {motion} from "framer-motion";
import {variants} from "../aside/aside-trends";
import {UserCard} from "../user/user-card";
import {MainHeader} from "../home/main-header";
import {useRouter} from "next/navigation";
import {useUser} from "../../../../context/user-context";
import useSWR from "swr";
import {getFriendByUserId, getPendingFriend} from "../../../../services/main/clientRequest/friendsClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {Error} from "@components/ui/error";
import cn from "clsx";
import {FriendRequestCard} from "../friend/FriendRequestCard";
import {mutateFriendRequest} from "@lib/hooks/mutateFriendRequest";
import {useRecoilState} from "recoil";
import {StatsEmpty} from "../content/stats-empty";

const ContainerFriendRequest = () => {
    const {currentUser} = useUser();
    const userId = currentUser?.id as string;
    const { data:friends, isLoading,mutate:mutateFriendRequests  } = useSWR(getPendingFriend(userId),fetcherWithToken );
    const [, setMutateFriends] = useRecoilState(mutateFriendRequest);
    useEffect(() => {
        setMutateFriends(() =>mutateFriendRequests);
    }, [mutateFriendRequests,setMutateFriends]);
    return (
        <>
            <section>
                {isLoading ? (
                    <Loading className='mt-5' />
                ) : !friends?.data ? (
                    <Error message='Something went wrong' />
                ) : friends?.data.length === 0 ?
                    (
                        <StatsEmpty
                            title='Không có lời bạn'
                            imageData={{ src:'/no-followers.png', alt: 'No friends' }}
                        />
                    )
                    : (
                        <>
                            <motion.div className='mt-0.5' {...variants}>
                                {friends?.data.map((userData:any) => (
                                    <FriendRequestCard {...userData} key={userData.id} follow />
                                ))}
                            </motion.div>
                            {/*<LoadMore />*/}
                        </>
                    )}
            </section>
        </>

    );
};

export default ContainerFriendRequest;