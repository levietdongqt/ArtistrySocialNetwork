'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {useState} from "react";
import Slider from "react-slick";

import {UserCard} from "../../_components/user/user-card";


export function ServiceMini(): JSX.Element {

    // State để quản lý trạng thái mở/đóng của Modal
    const [open, setOpen] = useState(false);

    // Hàm để mở Modal
    const openModal = () => setOpen(true);

    // Hàm để đóng Modal
    const closeModal = () => setOpen(false);
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    const images = [
        'https://cdn.wallpapersafari.com/27/76/Zsp0tf.jpg',
        'https://cdn.wallpapersafari.com/2/82/1LjaiN.jpg',
        'https://cdn.wallpapersafari.com/14/35/U94KSV.jpg',
        'https://cdn.wallpapersafari.com/8/10/Ukp3E0.jpg'
    ];
    const servicePagePath = '/service/123';
    return (
        <>
            <Link href={servicePagePath} passHref>
                <motion.div
                    className="block cursor-pointer z-1"

                    onClick={openModal} // Sự kiện onClick gọi hàm openModal
                    // whileHover={{ scale: 1.03 }} // Hiệu ứng hover tăng kích thước chút ít
                    whileTap={{ scale: 0.97 }} // Hiệu ứng khi click nhẹ giảm kích thước
                >


                    <div className="block cursor-pointer">
                        <div
                            className="rounded-lg  border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-lg">
                            {/* Slider */}
                            <div className="rounded-lg overflow-hidden z-1">
                                <Slider {...settings}>
                                    {images.map((img, idx) => (
                                        <div key={idx} className="w-full h-[250px] relative">
                                            <Image
                                                src={img}
                                                alt={`Service Image ${idx + 1}`}
                                                layout="fill"
                                                objectFit="contain"
                                                objectPosition="center center"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                            <div
                                className="accent-tab hover-animation grid grid-cols-1 gap-3 p-4 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5">
                                <div className="flex flex-col gap-1">
                                    <div className="text-lg font-semibold text-light-primary dark:text-dark-primary">
                                        {"Tên Dịch Vụ"}
                                    </div>
                                    <div className="text-sm text-light-secondary dark:text-dark-secondary">
                                        {"Giá: 1,000,000 VND"}
                                    </div>
                                    <div className="text-sm text-light-secondary dark:text-dark-secondary ">
                                        {"Đăng bởi: "}
                                        {/*<UserCard />*/}


                                    </div>
                                    {/* Mô tả ngắn hoặc tiêu chí khác của dịch vụ */}
                                    <p className="whitespace-normal text-sm mt-2">
                                        {"Mô tả ngắn về dịch vụ ở đây..."}
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