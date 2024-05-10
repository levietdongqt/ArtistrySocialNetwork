"use client";
import {Tabs} from "antd";
import {MainHeader} from "../../_components/home/main-header";
import {useRouter} from "next/navigation";
import ServiceMain from "../../_components/main-service/servcie-main";
import Promotions from "app/(users)/_components/main-service/promotions";
import ServiceExtra from "../../_components/extra-service/servcie-extra";
import WorkingTimes from "app/(users)/_components/main-service/workingtimes";

const items = [
    {
        key: "1",
        label: "Trang chủ",
        children: "Content of Tab Pane 1",
    },

    {
        key: "2",
        label: "Dịch vụ chính",
        children:<ServiceMain/> ,
    },
    {
        key: "3",
        label: "Dịch vụ Thêm",
        children: <ServiceExtra/>,
    },
    {
        key: "4",
        label: "Khuyến mãi",
        children: <Promotions/>,
    },
    {
        key: "5",
        label: "Thời gian làm việc",
        children: <WorkingTimes/>,
    },
];
export default function AdminMain() {
    
    const {back} = useRouter();
    return (
        <>
            <MainHeader useActionButton action={back}>
                Quay lại
            </MainHeader>
            <div>
                <Tabs items={items}/>
            </div>
        </>
    );
}
