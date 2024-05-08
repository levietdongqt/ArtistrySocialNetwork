'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, {useState} from "react";
import Slider from "react-slick";
import {Button, Carousel} from 'antd';

import {UserCard} from "../../_components/user/user-card";
import useSWR from "swr";
import {GetAllMainService} from "../../../../services/main/clientRequest/service";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {useUser} from "../../../../context/user-context";
// import * as console from "node:console";
import {MainService} from "@models/main-service";
import {Modal} from "../modal/modal";
import CreateReview from "../../(main-layout)/profile/[ID]/review/create-review";
import {EditOutlined, PlusCircleOutlined} from "@ant-design/icons";

interface ProServiceCard{
    data: MainService
}


export function ServiceCard({data}:ProServiceCard): JSX.Element {
    const [openModalCreateReview, setOpenModalCreateReview] = React.useState(false);

    const handleOpenCreateReview =()=>{
        setOpenModalCreateReview(true)
    }

    return (
        <>
            <Modal open={openModalCreateReview} closeModal={()=>setOpenModalCreateReview(false)}>
                <CreateReview closeModal={()=>setOpenModalCreateReview(false)} service={data}/>
            </Modal>
                {/*<Link href={`/service/${data.id}`} passHref>*/}
                    <motion.div className="block cursor-pointer z-1"  whileTap={{scale: 0.97}}>
                        <div className="block cursor-pointer">
                            <div
                                className=" flex-col rounded-lg  border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                                <div className="rounded-lg overflow-hidden z-1">
                                    <Carousel autoplay>
                                        {data?.imageUrls?.map((img, idx) => {

                                            return <div key={idx} className="w-full h-[300px] relative">
                                                <Image
                                                    src={img}
                                                    alt={`Service Image ${idx + 1}`}
                                                    layout="fill"
                                                    objectFit="cover" // Đổi sang 'cover' để hình ảnh chiếm đầy đủ không gian có sẵn.
                                                    objectPosition="center center"
                                                />
                                            </div>
                                        })}
                                    </Carousel>
                                </div>
                                <div
                                    className="accent-tab hover-animation grid grid-cols-1 gap-3 p-4 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5">
                                    <div className="flex flex-col gap-1">
                                        <div
                                            className="text-lg font-semibold text-light-primary dark:text-dark-primary">
                                            {data?.name} {/* Tên dịch vụ từ API */}
                                        </div>
                                        <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                            Giá: {data?.price} {/* Giá của dịch vụ từ API */}
                                        </div>
                                        <p className="whitespace-normal text-sm mt-2">
                                            {data?.description} {/* Mô tả dịch vụ từ API */}
                                        </p>
                                    </div>
                                </div>
                                <Button  onClick={handleOpenCreateReview}>

                                    <PlusCircleOutlined className="h-4 w-4 md:h-5 md:w-5" />
                                    Viết đánh giá

                                </Button>

                            </div>
                        </div>
                    </motion.div>
                {/*</Link>*/}


        </>
    );
};