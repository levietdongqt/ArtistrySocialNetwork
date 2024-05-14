'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {useState} from "react";
import Slider from "react-slick";
import { Carousel } from 'antd';

import {UserCard} from "../../_components/user/user-card";
import useSWR from "swr";
import {GetAllMainService, GetTrendMainService} from "../../../../services/main/clientRequest/service";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {useUser} from "../../../../context/user-context";
// import * as console from "node:console";
import {MainService} from "@models/main-service";
import {ServiceCard} from "../../_components/main-service/service-card";
import {Loading} from "@components/ui/loading";



export function ServiceAll(): JSX.Element {
    const {
        data: response,
        isLoading: isLoading,
        error: error2,
    } = useSWR(GetTrendMainService(), fetcherWithToken);
    if (isLoading) return <Loading className='flex h-52 items-center justify-center p-4' />;
    if (error2) return <div>Error: {error2.message}</div>;
    if (!Array.isArray(response?.data)) {
        return <div>Dữ liệu không hợp lệ.</div>;
    }


    return (
        <>
            <h2 className='text-xl font-bold text-center'>Dịch vụ</h2>
            {response?.data.map((service: MainService) => (
                <ServiceCard data={service}/>
            ))}
        </>
    );
};