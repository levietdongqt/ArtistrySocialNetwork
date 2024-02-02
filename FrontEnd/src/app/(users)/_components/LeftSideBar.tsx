import React, {Component} from 'react';
import Link from "next/link";
import {BsBell, BsThreeDots, BsTwitter} from "react-icons/bs";
import {BiHomeCircle, BiUser} from "react-icons/bi";
import {HiOutlineHashtag} from "react-icons/hi";
import {HiEnvelope} from "react-icons/hi2";
import { Popover } from 'antd';
import 'antd/es/popover/style/index';
import Image from 'next/image';
import logo from '../../../assets/img/logo.png';
const LeftSideBar = () =>  {
    const NAVIGATION_ITEMS = [
        {
            title: 'Home',
            icon: BiHomeCircle,
        },
        {
            title: 'Explore',
            icon : HiOutlineHashtag
        },
        {
            title: 'Notifications',
            icon :BsBell
        },
        {
            title: 'Messages',
            icon : HiEnvelope
        },
        {
            title: 'Book mark',
            icon: BiUser
        }
    ]
    const content = (
        <div  className={'text-black'}>
            Hello
        </div>
    )
        return (
            <section className={'sticky top-0 lg:w-[23%] md:w-[30%] sm:w-full flex flex-col items-stretch h-screen'}>
                <div className={'h-full flex flex-col items-stretch space-y-4 mt-4'}>
                    <Link
                        className={'hover:bg-white/10 transition duration-200 w-fit space-x-4 rounded-3xl py-2 mr-2'}
                        href={'/'}
                    >
                        <Image src={logo} alt="logo" className={' w-[30%]'}/>
                    </Link>
                    {NAVIGATION_ITEMS.map((item) => (
                        <Link
                            className={'hover:bg-white/10 transition duration-200 text-2xl flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'}
                            href={`/${item.title.toLowerCase()}`} key={item.title}
                        >
                            <div>
                                <item.icon />
                            </div>
                            {item.title !== "Twitter" && <div className={'hidden md:flex'}><p className={'text-xl'}>{item.title}</p></div>}
                        </Link>
                    ))}
                    <button className={'rounded-full m-4 bg-blue-400 p-4 text-2xl text-center hover:bg-opacity-70 transition duration-200'}>
                        Tweet
                    </button>
                </div>
                <Popover content={content} title="Account Information" trigger="click" color={'cyan'} >
                    <button className={'rounded-full m-4 bg-blue-400 p-4 text-2xl text-center hover:bg-opacity-70 transition duration-200 md:hidden'}>
                        Tweet
                    </button>
                    <button className={'rounded-full flex items-center bg-transparent p-4 space-x-2 hover:bg-white/10 transition duration-200 w-full justify-between'}>
                        <div className={'flex items-center space-x-2'}>
                            <div className={'rounded-full bg-slate-400 w-10 h-10'}></div>
                            <div className={'text-left text-sm'}>
                                <div className={'font-semibold'}>Club of Coders</div>
                                <div className={''}>@clubofcodercom</div>
                            </div>
                        </div>
                        <div>
                            <BsThreeDots />
                        </div>
                    </button>
                </Popover>
            </section>
        );
}

export default LeftSideBar;