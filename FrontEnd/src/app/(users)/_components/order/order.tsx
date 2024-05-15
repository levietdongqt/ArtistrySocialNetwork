import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {useUser} from "context/user-context";
import {useEffect, useState} from "react";
import {Modal} from "../modal/modal";
import useSWR from "swr";
import {addRowNumber} from "@lib/helper/addRowSerivce";
import {Button, Tabs} from "antd";
import {Order} from "@models/order";
import OrderTable from "./order-table";
import {getOrderByProvider} from "../../../../services/main/clientRequest/orderClient";


export default function Order() {
    const {currentUser} = useUser();
    const [changeStatus, setChangeStatus] = useState<Number>(0);
    const [orderPendingData, setOrderPendingData] = useState<Order[]>([]);
    const [orderActiveData, setOrderActiveData] = useState<Order[]>([]);
    const [reRender, setReRender] = useState(1)

    const [orderCancelledData, setOrderCancelledData] = useState<Order[]>([]);
    const [data, setData] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //Call all order api lấy data ở đây
    //Set data vào từng mảng theo trạng thái ở đây
    useEffect(() => {
        console.log("CallBACK FROM ORDER")
        getOrderByProvider().then((data) => {
            if (data.status === 200) {
                data.data.forEach((order: Order) => {
                    order.startDate = new Date(order.startDate);
                    order.endDate = new Date(order.endDate);
                    order.createDate = new Date(order.createDate);
                })
                setOrderPendingData(
                    addRowNumber(
                        data.data.filter((value: any) => value.status === 'PENDING').sort(
                            (a: any, b: any) =>
                                b.id - a.id
                        )
                    )
                );
                setOrderActiveData(
                    addRowNumber(
                        data.data.filter((value: any) => value.status === 'ACTIVE').sort(
                            (a: any, b: any) =>
                                b.id - a.id
                        )
                    )
                );
                setOrderCancelledData(
                    addRowNumber(
                        data.data.filter((value: any) => value.status === 'CANCELLED').sort(
                            (a: any, b: any) =>
                                b.id - a.id
                        )
                    )
                );
            }
        })
    }, [data, reRender]);

    //Hàm dùng để chuyển các dữ liệu theo status có sai thì em sửa ở đây cho phù hợp với status nhe, + với sửa ở OrderTable ở dưới
    const handleChange = () => {
        switch (changeStatus) {
            case 0:
                setChangeStatus(1);
                break
            case 1:
                setChangeStatus(2);
                break
            case 2:
                setChangeStatus(0);
                break
        }
    }
    return (
        <div>
            {
                changeStatus === 0 ? (
                        <div className={"text-center text-black  text-2xl"}>
                                DANH SÁCH CHỜ
                        </div>
                    ) :
                    changeStatus === 1 ? (
                            <div className={"text-center text-black text-2xl"}>
                                DANH SÁCH ĐƠN HÀNG ĐÃ CHẤP NHẬN
                            </div>
                        )
                        :
                        (
                            <div className={"text-center text-black  text-2xl"}>
                                DANH SÁCH ĐƠN HÀNG ĐÃ HUỶ
                            </div>
                        )
            }
            <div>
                {
                    changeStatus === 0 ? (
                            <Button type="dashed" onClick={handleChange}>
                                XEM DANH SÁCH CHẤP NHẬN
                            </Button>
                        ) :
                        changeStatus === 1 ? (
                                <Button type="dashed" onClick={handleChange}>
                                    XEM DANH SÁCH ĐÃ HUỶ
                                </Button>
                            )
                            :
                            (
                                <Button type="dashed" onClick={handleChange}>
                                    XEM DANH SÁCH CHỜ
                                </Button>
                            )
                }
            </div>
            <OrderTable
                callback={() => setReRender(prevState => prevState + 1)}
                data={changeStatus === 0 ? orderPendingData as any : changeStatus === 1 ? orderActiveData : orderCancelledData}></OrderTable>
        </div>
    );
}
