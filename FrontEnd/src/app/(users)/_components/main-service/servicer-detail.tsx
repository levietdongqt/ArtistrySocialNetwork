'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import React, {useState} from "react";
import {Modal, Carousel, ConfigProvider, Dropdown, Menu, MenuProps, Typography} from 'antd';
import {MainService} from "@models/main-service";
import Link from "next/link";
import {UserTooltip} from "../user/user-tooltip";
import {UserAvatar} from "../user/user-avatar";
import {User} from "@models/user";
import {EllipsisOutlined, HeartOutlined, PlusCircleOutlined} from "@ant-design/icons";
import DOMPurify from "dompurify";


interface ProServiceDetail {
    data: MainService;
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
}


const ServiceDetail: React.FC<ProServiceDetail> = ({ data, isModalVisible, setIsModalVisible }) => {

    const [openModalCreateReview, setOpenModalCreateReview] = React.useState(false);
    const handleOpenCreateReview =()=>{
        setOpenModalCreateReview(true)
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const provider: User | null = data?.provider ;
    const decription = data?.description;
    const cleanFullBioContent = DOMPurify.sanitize(decription);
    const formatDate = (date?: Date) => {
        return date ? new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) : '';
    }
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

        ]} />
    );





    return (



            <Modal
                title={data?.name} // Tên dịch vụ từ API
                visible={isModalVisible}
                onCancel={handleCancel}
                width={800} // Thiết lập kích thước modal
                footer={null} // Nếu không muốn sử dụng footer mặc định của Ant Design
            >
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


                                <div
                                    className="text-sm text-light-secondary dark:text-dark-secondary flex items-center">
                                    <span className="mr-2">Nhà cung cấp:</span>
                                    <UserTooltip
                                        avatar={provider!.avatar}
                                        id={provider!.id}             // Lấy giá trị id từ API hoặc data của bạn
                                        bio={''}                       // Lấy giá trị bio từ API hoặc data của bạn
                                        fullName={provider!.fullName}  // Lấy giá trị fullName từ API hoặc data của bạn
                                        verified={provider?.verified ?? true}      // Lấy giá trị verified từ API hoặc data của bạn
                                        coverImage={provider?.coverImage ?? ''}   // Lấy giá trị coverImage từ API hoặc data của bạn
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

                                <div
                                    dangerouslySetInnerHTML={{__html: cleanFullBioContent}}>

                                </div>


                                {data.priceType && (
                                    <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                        Loại giá: {data.priceType}
                                    </div>
                                )}
                                {data.duration && (
                                    <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                        Thời lượng: {data.duration} phút
                                    </div>
                                )}
                                {data.restTime && (
                                    <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                        Thời gian nghỉ: {data.restTime} phút
                                    </div>
                                )}
                                {data.createDate && (
                                    <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                        Ngày tạo: {formatDate(data.createDate)}
                                    </div>
                                )}
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
            </Modal>



    );
};

export default ServiceDetail;