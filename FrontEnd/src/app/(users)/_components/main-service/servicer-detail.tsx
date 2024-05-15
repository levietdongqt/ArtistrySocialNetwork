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
import {EllipsisOutlined, HeartOutlined, LeftOutlined, PlusCircleOutlined, RightOutlined} from "@ant-design/icons";
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
    // const promotion = data?.promotionDTO ;
    const promotion : {
        discountPercent: number;
        endDate: Date;
        name: string;
        description: string;
        id: number;
        startDate: Date
    } = {
        id: 1,
        name: 'Giảm giá 10%',
        description: 'Get a 20% discount on all beachwear.',
        discountPercent: 20, // Đây là giả định rằng discountRate là phần trăm
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-07-31'),
        // Thêm bất kỳ giá trị mặc định nào cho các thuộc tính khác
    };
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


                <div
                    className=" flex-col rounded-lg  border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                    <div className="rounded-lg overflow-hidden z-1">
                        <Carousel autoplay >
                            {data?.imageUrls?.map((img, idx) => {

                                return <div key={idx} className="w-full h-[460px] relative">
                                    <Image
                                        src={img}
                                        alt={`Service Image ${idx + 1}`}
                                        layout="fill"
                                        objectFit="contain" // Đổi sang 'cover' để hình ảnh chiếm đầy đủ không gian có sẵn.
                                        objectPosition="center"
                                    />
                                </div>
                            })}
                        </Carousel>
                    </div>

                    <div
                        className="accent-tab hover-animation grid grid-cols-10 gap-3 p-4 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
                    >
                        {/* Col span 6 cho tỉ lệ 6/10 */}
                        <div className="flex flex-col gap-1 col-span-6">
                            <div
                                className="text-lg font-semibold text-light-primary dark:text-dark-primary text-right">
                                {data?.name} {/* Tên dịch vụ từ API */}
                            </div>
                        </div>
                        {/* Col span 4 cho tỉ lệ 4/10 */}
                        <div className="flex flex-col justify-between col-span-4">
                            <div className="text-right">
                                <Dropdown overlay={menu} placement="bottomRight">
                                    <EllipsisOutlined/>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    <div
                        className="accent-tab hover-animation grid grid-cols-2 gap-3 p-4 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
                    >
                        {/* Các trường cho cột thứ nhất */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm text-light-secondary dark:text-dark-secondary">
                                <strong>Nhà cung cấp:</strong>
                                <div className="ml-2">
                                    <UserTooltip
                                        avatar={provider!.avatar}
                                        id={provider!.id}             // Lấy giá trị id từ API hoặc data của bạn
                                        bio={''}                       // Lấy giá trị bio từ API hoặc data của bạn
                                        fullName={provider!.fullName}  // Lấy giá trị fullName từ API hoặc data của bạn
                                        verified={provider?.verified ?? true}      // Lấy giá trị verified từ API hoặc data của bạn
                                        coverImage={provider?.coverImage ?? ''}   // Lấy giá trị coverImage từ API hoặc data của bạn
                                    >
                                        <UserAvatar
                                            id={provider!.id}
                                            src={provider!.avatar}
                                            alt={provider!.fullName}
                                            username={provider!.fullName}
                                        />
                                    </UserTooltip>
                                </div>
                            </div>
                            <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                <strong>Giá</strong>:
                                {promotion && promotion.discountPercent
                                    ? <>
        <span className="line-through">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.price)}
        </span>{" "}
                                        VNĐ - <span>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.price * (1 - promotion.discountPercent / 100))}
        </span> VNĐ
                                    </>
                                    : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.price)} VNĐ`
                                }
                            </div>

                            {promotion?.endDate && (
                                <div
                                    className="text-sm text-light-secondary dark:text-dark-secondary"
                                    title={`Áp dụng đến ${new Date(promotion.endDate).toLocaleDateString('vi-VN')}`}
                                >
                                    (<strong>Khuyến mãi</strong>: {promotion.name})
                                </div>
                            )}


                            <div className="flex flex-col justify-between">
                                {data.priceType && (
                                    <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                        <strong> Giá được tính theo:</strong> {data.priceType}
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Các trường cho cột thứ hai */}
                        <div className="flex flex-col justify-between">

                            {data.duration && (
                                <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                    <strong> Thời lượng:</strong> {data.duration} Giờ
                                </div>
                            )}
                            {data.restTime > 0 && (
                                <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                    <strong> Thời gian nghỉ:</strong> {data.restTime} phút
                                </div>
                            )}
                            {data.createDate && (
                                <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                    <strong> Ngày tạo:</strong> {formatDate(data.createDate)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-2" dangerouslySetInnerHTML={{__html: cleanFullBioContent}}></div>

                </div>


            </Modal>


    );
};

export default ServiceDetail;