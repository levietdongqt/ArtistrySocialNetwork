'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {useState} from "react";
import Slider from "react-slick";
import { Carousel } from 'antd';

import {UserCard} from "../../_components/user/user-card";
import useSWR from "swr";
import {GetAllMainService} from "../../../../services/main/clientRequest/service";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {useUser} from "../../../../context/user-context";
// import * as console from "node:console";
import {MainService} from "@models/main-service";
import {ServiceCard} from "../../_components/main-service/service-card";



export function ServiceProvider(): JSX.Element {

    const { currentUser } = useUser();
    const id = '1cb1c09e-79be-484b-9a6a-4d5728e04727'
    const {
        data: response,
        isLoading: isLoading,
        error: error2,
    } = useSWR(GetAllMainService(id), fetcherWithToken);
    if (isLoading) return <div>Loading...</div>;
    if (error2) return <div>Error: {error2.message}</div>;
    if (!Array.isArray(response?.data)) {
        return <div>Dữ liệu không hợp lệ.</div>;
    }
    // console.log('service',response)
    // State để quản lý trạng thái mở/đóng của Modal
    // const [open, setOpen] = useState(false);
    //
    //
    // const openModal = () => setOpen(true);
    // const closeModal = () => setOpen(false);
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };


    const servicePagePath = '/service/123';

    return (
        <>
            {response?.data.map((service: MainService) => (
                <ServiceCard data={service}/>
            ))}
        </>
    );
};