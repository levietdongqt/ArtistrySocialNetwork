'use client'
import {BsChat, BsDot, BsThreeDots} from "react-icons/bs";
import {AiOutlineHeart, AiOutlineRetweet} from "react-icons/ai";
import {IoShareOutline, IoStatsChart} from "react-icons/io5";
import PostNews from "@/app/(users)/_components/PostNews";
import {ConfigProvider, Popover} from 'antd';

const Main = () => {
    const content = (
        <div>
            <p>Hello</p>
            <p>Hello</p>
            <p>Hello</p>
            <p>Hello</p>
            <p>Hello</p>
            <p>Hello</p>
            <p>Hello</p>
        </div>
    )
    return (
        <main className={'flex xl:w-[52%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600'}>
            <h1 className={'text-xl font-bold p-6 bg-black/10 sticky top-0 backdrop-blur '}>Home</h1>
            <div
                className={'border-t-[0.5px] border-b-[0.5px] px-4 border-gray-600 relative flex items-stretch py-6 space-x-2'}>
                <div className={'w-10 h-10 bg-slate-400 rounded-full flex-none'}></div>
                <PostNews/>
            </div>
            <div className={'flex flex-col'}>
                {
                    Array.from({length: 10}).map((_, i) => (
                        <div key={i} className={'border-b-[0.5px] p-2 flex space-x-4 border-gray-600'}>
                            <div>
                                <div className={'w-10 h-10 bg-slate-200 rounded-full'}/>
                            </div>
                            <div className={'flex flex-col'}>
                                <div className={'flex items-center justify-between w-full'}>
                                    <div className={'flex items-center space-x-1 w-full'}>
                                        <div className={'font-bold'}>Club of Coders</div>
                                        <div className={'text-gray-500'}>@clubofcoderscom</div>
                                        <div className={'text-gray-500'}>
                                            <BsDot/>
                                        </div>
                                        <div className={'text-gray-500'}>1 hour ago</div>
                                    </div>
                                    <ConfigProvider>
                                    <Popover content={content} trigger="click" color={'cyan'} placement="leftTop"  >
                                        <button> <BsThreeDots/></button>
                                    </Popover>
                                    </ConfigProvider>
                                </div>
                                <div className={'text-white text-base'}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry standard dummy text ever since the
                                    1500s, when an unknown printer took a galley of type and scrambled it to
                                    make a type specimen book. It has survived not only five centuries,
                                </div>
                                <div className={'bg-slate-400 aspect-square w-full h-80 rounded-xl mt-2'}>

                                </div>
                                <div className={'flex items-center justify-start space-x-20 mt-2 w-full'}>
                                    <div
                                        className={'rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer '}>
                                        <BsChat/></div>
                                    <div
                                        className={'rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer '}>
                                        <AiOutlineRetweet/></div>
                                    <div
                                        className={'rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer '}>
                                        <AiOutlineHeart/></div>
                                    <div
                                        className={'rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer '}>
                                        <IoStatsChart/></div>
                                    <div
                                        className={'rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer '}>
                                        <IoShareOutline/></div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </main>
    )
};

export default Main;