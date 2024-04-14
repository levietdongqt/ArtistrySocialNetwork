'use client'
import React from 'react';
import {Loading} from "@components/ui/loading";
import {motion} from "framer-motion";
import {variants} from "../aside/aside-trends";
import {UserCard} from "../user/user-card";
import {MainHeader} from "../home/main-header";
import {useRouter} from "next/navigation";
import {SearchNav} from "../search/search-nav";
import SearchMain from '../search/search-main';


const ContainerSearch = () => {
    const { back } = useRouter();

    const loading = false;
    return (
        <>
            <MainHeader useActionButton action={back} search={'hahaha'} />
            <section>
                    <>
                        <motion.div className='mt-0.5' {...variants}>
                            <SearchMain></SearchMain>
                        </motion.div>
                    </>
            </section>
        </>

    );
};

export default ContainerSearch;