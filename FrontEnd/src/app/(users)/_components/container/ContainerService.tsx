'use client'
import React, {ReactNode, useEffect, useMemo} from 'react';
import {Button} from "@components/ui/button";
import {HeroIcon} from "@components/ui/hero-icon";
import {ToolTip} from "@components/ui/tooltip";
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {useModal} from "@lib/hooks/useModal";
import {ActionModal} from "../modal/action-modal";
import {MainHeader} from "../home/main-header";
import {StatsEmpty} from "../content/stats-empty";
import {useUser} from "../../../../context/user-context";
import {Modal} from "../modal/modal";
import useSWR from "swr";
import {getBookmarksByUserId} from "../../../../services/realtime/clientRequest/bookmarksClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {getPostById, getPostListByPostId} from "../../../../services/realtime/clientRequest/postClient";
import {ContentPost} from "../content/content";
import {toast} from "react-toastify";
import {deleteAllBokMarksByUserId} from "../../../../services/realtime/ServerAction/bookmarksService";
import {SEO} from "../common/seo";
import {deleteSavedMainService, GetAllSavedMainService} from "../../../../services/main/clientRequest/service";
import {ServiceCard} from "../main-service/service-card";
import {useRecoilState} from "recoil";
import {mutateSavedService} from "@lib/hooks/mutateSavedService";
import {Form} from "antd";
import {useInfiniteScroll} from "@lib/hooks/useInfiniteScroll";
import InfiniteScroll from "react-infinite-scroll-component";
import {MainService} from "@models/main-service";


const ContainerService = () => {
    const { currentUser } = useUser();

    const { open, openModal, closeModal } = useModal();

    const userId = useMemo(() => currentUser?.id as string, [currentUser]);
    const { paginatedPosts: savedRef, isLoadingMore: savedRefLoading,mutate: savedRefMutate,isReachedEnd,LoadMore,size,setSize,error } = useInfiniteScroll(GetAllSavedMainService);
    const [,setMutateSaved] = useRecoilState(mutateSavedService);
    useEffect(() => {
        setMutateSaved(()=>savedRefMutate);
    }, [savedRefMutate,setMutateSaved]);
    const handleClear = async (): Promise<void> => {
        await deleteSavedMainService(userId);
        await savedRefMutate();
        closeModal();
        toast.success('Xóa tất cả dịch vụ thành công');
    };

    const theEndPost = (): ReactNode => {
        return (
            <div className={'mt-10'}>
                <p className='text-center text-gray-500 text-2xl font-bold'>Không còn dịch vụ</p>
            </div>
        )
    }
    return (
        <>
            <Modal
                modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
                open={open}
                closeModal={closeModal}
            >
                <ActionModal
                    actionReport={()=>{}}
                    title='Xóa tất cả bài dịch vụ đẫ lưu'
                    description='Có thể mất tất cả bài services đã lưu không thể hồi phục'
                    mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90'
                    mainBtnLabel='Xóa'
                    action={handleClear}
                    closeModal={closeModal}
                />
            </Modal>
            <MainHeader className='flex items-center justify-between'>
                <div className='-mb-1 flex flex-col'>
                    <h2 className='-mt-1 text-xl font-bold'>Filter</h2>
                </div>
                <Form className={'flex gap-2'}>
                    <div className={'py-1'}>
                        <HeroIcon iconName={'MagnifyingGlassIcon'}/>
                    </div>
                    <input type="search" name={'search'} className={'border-2 border-black rounded py-1 px-2'} placeholder={'Tìm kiếm'}/>
                </Form>
                <Button
                    className='dark-bg-tab group relative p-2 hover:bg-light-primary/10
                     active:bg-light-primary/20 dark:hover:bg-dark-primary/10
                     dark:active:bg-dark-primary/20'
                    onClick={openModal}
                >
                    <HeroIcon className='h-5 w-5' iconName='ArchiveBoxXMarkIcon' />
                    <ToolTip
                        className='!-translate-x-20 translate-y-3 md:-translate-x-1/2'
                        tip='xóa dịch vụ'
                    />
                </Button>
            </MainHeader>
            <section className='mt-0.5'>
                {savedRefLoading  ? (
                    <Loading className='mt-5' />
                ) : !savedRef || savedRef?.length === 0 ? (
                    <StatsEmpty
                        title='Lưu bài dịch vụ'
                        description='Đừng để dịch vụ của bạn mất'
                        imageData={{ src: '/no-bookmarks.png', alt: 'No services' }}
                    />
                ) : (
                    <InfiniteScroll style={{overflow: 'initial'}} next={() => setSize(size as number + 1)}
                                    hasMore={!isReachedEnd}
                                    loader={savedRef?.map((content)=> content === undefined ? null : <LoadMore />)}
                                    dataLength={savedRef?.length as number ?? 0}
                                    endMessage={!isReachedEnd ? theEndPost() : ''}>
                        <AnimatePresence mode='popLayout'>
                            {savedRef?.map((service:any) => {
                                if (service.status) {
                                    <ServiceCard data={service} key={service.id}/>
                                } return null})}
                        </AnimatePresence>
                    </InfiniteScroll>
                )}
            </section>
        </>
    );
};

export default ContainerService;