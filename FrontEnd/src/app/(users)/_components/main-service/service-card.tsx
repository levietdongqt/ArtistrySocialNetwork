'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import React, {useState} from "react";
import {Button, Carousel, ConfigProvider, Dropdown, Menu, MenuProps, Typography} from 'antd';
import {MainService} from "@models/main-service";
import {Modal} from "../modal/modal";
import CreateReview from "../../(main-layout)/profile/[ID]/review/create-review";
import {CalendarOutlined, EditOutlined, EllipsisOutlined, HeartOutlined, PlusCircleOutlined} from "@ant-design/icons";
import { TinyColor } from '@ctrl/tinycolor';
import Link from "next/link";
import {UserTooltip} from "../user/user-tooltip";
import {UserAvatar} from "../user/user-avatar";
import {User} from "@models/user";

interface ProServiceCard{
    data: MainService
}


export function ServiceCard({data}:ProServiceCard): JSX.Element {
    const [openModalCreateReview, setOpenModalCreateReview] = React.useState(false);
    const handleOpenCreateReview =()=>{
        setOpenModalCreateReview(true)
    }
    const provider: User | null = data?.provider ;

    const menu = (
        <Menu items={[
            {
                key: '1',
                label: (
                    <Link href="">
                        <div className="flex items-center">
                            <HeartOutlined className="mr-2" />
                            Lưu dịch vụ
                        </div>
                    </Link>
                ),
            },
            {
                key: '2',
                label: (
                    <div onClick={handleOpenCreateReview} className="flex items-center">
                        <PlusCircleOutlined className="mr-2" />
                        Viết đánh giá
                    </div>
                ),
            },
        ]} />
    );





    return (
        <>
            <Modal open={openModalCreateReview} closeModal={()=>setOpenModalCreateReview(false)}>
                <CreateReview closeModal={()=>setOpenModalCreateReview(false)} service={data}/>
            </Modal>
                {/*<Link href={`/service/${data.id}`} passHref>*/}
                    <motion.div className="block cursor-pointer z-1 py-2.5"  whileTap={{scale: 0.97}}>
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
                                <div className="flex justify-center">
                                    <div className="text-lg font-semibold text-light-primary dark:text-dark-primary">
                                        {data?.name} {/* Tên dịch vụ từ API */}
                                    </div>
                                </div>
                                <div
                                    className="accent-tab hover-animation grid grid-cols-2 gap-3 p-4 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5">
                                    {/* Cột thứ nhất: Tên dịch vụ, Giá và Mô tả */}
                                    <div className="flex flex-col gap-1">


                                        <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                            <UserTooltip
                                                avatar={provider!.avatar}
                                                id={provider!.id}         // Lấy giá trị id từ API hoặc data của bạn
                                                bio={''}       // Lấy giá trị bio từ API hoặc data của bạn
                                                fullName={provider!.fullName} // Lấy giá trị fullName từ API hoặc data của bạn
                                                verified={provider?.verified ?? true} // Lấy giá trị verified từ API hoặc data của bạn
                                                coverImage={provider?.coverImage ?? ''} // Lấy giá trị coverImage từ API hoặc data của bạn
                                            >
                                                    <UserAvatar
                                                        src={provider!.avatar}
                                                        alt={provider!.fullName}
                                                        username={provider!.fullName}
                                                    />

                                            </UserTooltip>
                                        </div>
                                        <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                            Giá: {data?.price} {/* Giá của dịch vụ từ API */}
                                        </div>

                                        <p className="whitespace-normal text-sm mt-2">
                                            {data?.description && data.description.length > 30
                                                ? data.description.substring(0, 30) + "..."
                                                : data.description}
                                        </p>
                                    </div>


                                    <div className="flex flex-col justify-between">

                                        <div className="text-right">
                                            <Dropdown overlay={menu} placement="bottomRight">
                                                <EllipsisOutlined/>
                                            </Dropdown>
                                        </div>

                                        <button type="submit"
                                                className="self-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                            Đặt Dịch vụ
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
            {/*</Link>*/}


        </>
    );
};