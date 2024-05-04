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

interface ProServiceCard{
    data: MainService
}


export function ServiceCard({data}:ProServiceCard): JSX.Element {


    return (
        <>

                <Link href={`/service/${data.id}`} passHref>
                    <motion.div className="block cursor-pointer z-1"  whileTap={{scale: 0.97}}>
                        <div className="block cursor-pointer">
                            <div
                                className=" flex-col rounded-lg  border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                                <div className="rounded-lg overflow-hidden z-1">
                                    <Carousel autoplay>
                                        {data?.imageUrls?.map((img, idx) => {
                                            console.log('image url', img)
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
                            </div>
                        </div>
                    </motion.div>
                </Link>


        </>
    );
};