'use client'

import {motion} from 'framer-motion';
import Image from 'next/image';
import React, {useState} from "react";
import {Button, Carousel, ConfigProvider, Dropdown, Menu, MenuProps, Typography} from 'antd';
import {MainService} from "@models/main-service";
import {Modal} from "../modal/modal";

import {CalendarOutlined, EditOutlined, EllipsisOutlined, HeartOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {TinyColor} from '@ctrl/tinycolor';
import Link from "next/link";
import {UserTooltip} from "../user/user-tooltip";
import {UserAvatar} from "../user/user-avatar";
import {User} from "@models/user";

import DOMPurify from "dompurify";
import BookingModal from "../booking/bookingModal";
import CreateReview from "../../(main-layout)/profile/[ID]/review/create-review";
import ServiceDetail from "./servicer-detail";
import {Promotion} from "@models/promotion";
import {preventBubbling} from "@lib/utils";
import {useUser} from "../../../../context/user-context";
import {savedMainService} from "../../../../services/main/clientRequest/service";
import {toast} from "react-toastify";
import {useRecoilValue} from "recoil";
import {mutateSavedService} from "@lib/hooks/mutateSavedService";


interface ProServiceCard {
    data: MainService
}


export function ServiceCard({data}: ProServiceCard): JSX.Element {
    const [openModalCreateReview, setOpenModalCreateReview] = React.useState(false);
    const [openModalServiceDetail, setOpenModalServiceDetail] = useState(false);
    const [openBookingModal, setOpenBookingModal] = useState(false)
    const [isCheckService, setIsCheckService] = useState(false);
    const handleOpenCreateReview = () => {
        setOpenModalCreateReview(true)
    }
    const handleOpenServiceDetail = () => {
        setOpenModalServiceDetail(true);
    }
    const [isPreviewImage, setIsPreviewImage] = useState(false);
    const {currentUser} = useUser();
    const userId = currentUser?.id as string;
    const provider: User | null = data?.provider;
    const promotion:any |null = data?.promotionDTO;
    const decription = data?.description;
    const cleanFullBioContent = DOMPurify.sanitize(decription);
    const mutateSaved = useRecoilValue(mutateSavedService);
    const handleAddToFavorite = async () =>{
        try{
            const item = {
                userId: userId,
                mainServiceId: data?.id
            }
            await savedMainService(item);
            if (mutateSaved) {
                await mutateSaved();
            }
            setIsCheckService(true);
            toast.success(
                `Đã lưu services ${data?.name} thành công`,
            );
        }catch (e){
            console.log(e);
            toast.success(
                `Đã lưu services ${data?.name} thất bại`,
            );
        }
    }
    const menu = (
        <Menu items={[
            {
                key: '1',
                label: (
                    <Button onClick={preventBubbling(handleAddToFavorite)} className={'w-full border-0'}>
                        <div className="flex items-center">
                            <HeartOutlined className="mr-2"/>
                            Lưu dịch vụ
                        </div>
                    </Button>
                ),
            },
            {
                key: '2',
                label: (
                    <Button onClick={handleOpenCreateReview} className={'w-full border-0'}>
                        <div className="flex items-center">
                            <PlusCircleOutlined className="mr-2"/>
                            Viết đánh giá
                        </div>
                    </Button>
                ),
            },
        ]}/>
    );


    return (
        <>
            <Modal open={isPreviewImage} closeModal={()=> setIsPreviewImage(false)} >
                <div className="max-w-2xl w-full h-auto">
                    <div className="rounded-lg overflow-hidden z-10" >
                        .
                        <Carousel autoplay arrows >
                            {data?.imageUrls?.map((img, idx) => (
                                <div key={idx} className="w-full h-[600px] relative">
                                    <Image
                                        src={img}
                                        alt={`Service Image ${idx + 1}`}
                                        layout="fill"
                                        objectFit="contain"
                                        objectPosition="center"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </Modal>

            <Modal open={openModalCreateReview} closeModal={() => setOpenModalCreateReview(false)}>
                <CreateReview closeModal={() => setOpenModalCreateReview(false)} service={data}/>
            </Modal>
            {
                openBookingModal &&
                <Modal
                    modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
                    open={openBookingModal}
                    closeModal={() => setOpenBookingModal(false)}>
                    <BookingModal providerId={data.provider?.id!} mainService={data}
                                  closeModal={() => setOpenBookingModal(false)}/>
                </Modal>
            }
            <ServiceDetail data={data} isModalVisible={openModalServiceDetail}
                           setIsModalVisible={setOpenModalServiceDetail}/>
            {/*<Link href={`/service/${data.id}`} passHref>*/}

                <div className="block cursor-pointer">
                    <div
                        className=" flex-col rounded-lg  border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                        <div className="rounded-lg overflow-hidden z-10" onClick={()=> setIsPreviewImage(true)}>
                            <Carousel autoplay>
                                {data?.imageUrls?.map((img, idx) => (
                                    <div key={idx} className="w-full h-[300px] relative">
                                        <Image
                                            src={img}
                                            alt={`Service Image ${idx + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                            objectPosition="center center"
                                        />
                                    </div>
                                ))}
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
                                            id={provider!.id}
                                            src={provider!.avatar}
                                            alt={provider!.fullName}
                                            username={provider!.fullName}
                                        />

                                    </UserTooltip>
                                </div>

                                <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                    <strong>Giá</strong>:{" "}
                                    {promotion && promotion.status && promotion.discountPercent
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

                                {promotion && promotion.status && promotion.endDate && (
                                    <div
                                        className="text-sm text-light-secondary dark:text-dark-secondary"
                                        title={`Áp dụng đến ${new Date(promotion.endDate).toLocaleDateString('vi-VN')}`}
                                    >
                                        (<strong>Khuyến mãi</strong>: {promotion.name})
                                    </div>
                                )}
                                <div
                                    dangerouslySetInnerHTML={{__html: cleanFullBioContent.substring(0, 70) + (cleanFullBioContent.length > 70 ? '...' : '')}}>

                                </div>
                            </div>


                            <div className="flex flex-col justify-between">

                                <div className="text-right">
                                    <Dropdown overlay={menu} placement="bottomRight">
                                        <EllipsisOutlined/>
                                    </Dropdown>
                                </div>

                                <button type="button"
                                        className="self-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        onClick={() => setOpenBookingModal(true)}
                                >
                                    Đặt Dịch vụ
                                </button>

                                <div onClick={handleOpenServiceDetail}
                                     className="cursor-pointer text-blue-500 hover:text-blue-700 transition ease-in duration-300">
                                    Xem chi tiết...
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            {/*</Link>*/}


        </>
    );
};