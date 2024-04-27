"use client";
import {Tabs} from "antd";
import CreateMainServiceForm from "./main-service/create-service";
import CreateExtraServiceForm from "./extra-service/create-service";
import {MainHeader} from "../../_components/home/main-header";
import {useRouter} from "next/navigation";
import {Input} from "../../_components/input/input";
import ServiceMain from "../../_components/main-service/servcie-main";

const items = [
    {
        key: "1",
        label: "Trang chủ",
        children: "Content of Tab Pane 1",
    },

    {
        key: "2",
        label: "Dịch vụ chính",
        children: <ServiceMain/>,
    },
    {
        key: "3",
        label: "Dịch vụ Thêm",
        children: <CreateMainServiceForm/>,
    },
    {
        key: "4",
        label: "Khuyến mãi",
        children: "sdsdf",
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
