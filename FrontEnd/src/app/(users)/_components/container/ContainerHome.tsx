'use client'
import React, {useEffect} from 'react';
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {Content} from "../content/content";
import {getCookie} from "cookies-next";
import {useAuth} from "../../../../context/auth-context";

function ContainerHome() {

    const loading = false;
    /*console.log("Home " + UseTweet().data);
   const { data, loading, LoadMore } = useInfiniteScroll(
       UseTweet().data,
       { allowNull: true, preserve: true },
       { marginBottom: 500 }
   );*/
    const {user} = useAuth();
    useEffect(() => {
        console.log("User ", user);
    }, []);

    return (
            <section className='mt-0.5 xs:mt-0'>
                {loading ? (
                    <Loading className='mt-5' />
                ) : /*!data ? (
                                <Error message='Something went wrong' />
                            ) : */(
                    <>
                        <AnimatePresence mode='popLayout'>
                            {/*{data.map((content) => (*/}
                            {/*<Content {...content} key={content.id}/>*/}
                            <Content  modal parentTweet pinned={false}/>
                            {/*  ))}*/}
                        </AnimatePresence>
                        {/* <LoadMore />*/}
                    </>
                )}
            </section>
    );
}

export default ContainerHome;