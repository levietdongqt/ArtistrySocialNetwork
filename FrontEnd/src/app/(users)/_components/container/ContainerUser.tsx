'use client';
import React from 'react';
import { Loading } from '@components/ui/loading';
import { AnimatePresence } from 'framer-motion';
import {useParams} from "next/navigation";
import useSWR from "swr";
import {getUserById} from "../../../../services/main/clientRequest/userClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {ContentPost} from "../content/content";
import PostUser from "../../(main-layout)/profile/[ID]/post/post-user";
import DOMPurify from 'dompurify';

const ContainerUser = () => {

    const { ID } = useParams()
    const {data: response,isLoading:loading} = useSWR(getUserById(ID as string), fetcherWithToken);
    const isProvider = response?.data?.roles?.includes('ROLE_PROVIDER');
    const bioContent = response?.data?.bio || '';
    const cleanBioContent = DOMPurify.sanitize(bioContent);
    return (
        <section>
            {loading ? (
                <Loading className='mt-5' />
            ) : isProvider ? (
                <div dangerouslySetInnerHTML={{__html: cleanBioContent}}/>
            ) : (
                <AnimatePresence mode='popLayout'>
                  <PostUser/>
                </AnimatePresence>
            )}
        </section>
    );
};

export default ContainerUser;