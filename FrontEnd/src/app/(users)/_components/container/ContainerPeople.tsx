'use client'
import React from 'react';
import {Loading} from "@components/ui/loading";
import {motion} from "framer-motion";
import {variants} from "../aside/aside-trends";
import {UserCard} from "../user/user-card";
import {MainHeader} from "../home/main-header";
import {useRouter} from "next/navigation";

const ContainerPeople = () => {
    /*const user = UseUser([]);*/
    /*const { data, loading, LoadMore } = useInfiniteScroll(
            user,
        { allowNull: true, preserve: true },
        { marginBottom: 500 }
    );*/
    const { back } = useRouter();

    const loading = false;
    return (
        <>
            <MainHeader useActionButton title='Studio' action={back} />
            <section>
                {loading ? (
                    <Loading className='mt-5' />
                ) : /*!data ? (
                        <Error message='Something went wrong' />
                    ) : */(
                    <>
                        <motion.div className='mt-0.5' {...variants}>
                            {/* {data?.map((userData:any) => (*/}
                            {/*<UserCard {...userData} key={userData.id} follow />*/}
                            <UserCard  follow />
                            {/* ))}*/}
                        </motion.div>
                        {/*<LoadMore />*/}
                    </>
                )}
            </section>
        </>

    );
};

export default ContainerPeople;