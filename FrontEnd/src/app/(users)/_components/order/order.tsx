import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { Modal } from "../modal/modal";
import useSWR from "swr";
import { addRowNumber } from "@lib/helper/addRowSerivce";
import { Button, Tabs } from "antd";
import { OrderDTO } from "@models/order";
import OrderTable from "./order-table";


export default function Order() {
  const { currentUser } = useUser();
  const [changeStatus,setChangeStatus] = useState<Number>(0);
  const [orderPendingData, setOrderPendingData] = useState<OrderDTO[]>([]);
  const [orderActiveData, setOrderActiveData] = useState<OrderDTO[]>([]);
  const [orderCancelledData, setOrderCancelledData] = useState<OrderDTO[]>([]);
  
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
  const data : any = {
    data: []
  };
  //Set data vào từng mảng theo trạng thái ở đây
  useEffect(() => {
    if (data) {
      setOrderPendingData(
        addRowNumber(
          data.data.filter((value:any) => value.status === 'PENDING').sort(
            (a: any, b: any) =>
              b.id - a.id
          )
        )
      );
      setOrderActiveData(
        addRowNumber(
          data.data.filter((value:any) => value.status === 'ACTIVE').sort(
            (a: any, b: any) =>
              b.id - a.id
          )
        )
      );
      setOrderCancelledData(
        addRowNumber(
          data.data.filter((value:any) => value.status === 'CANCELLED').sort(
            (a: any, b: any) =>
              b.id - a.id
          )
        )
      );
    }
  }, [data]);

  //Hàm dùng để chuyển các dữ liệu theo status có sai thì em sửa ở đây cho phù hợp với status nhe, + với sửa ở OrderTable ở dưới
  const handleChange = () =>{
    switch(changeStatus){
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
            <Button type="dashed" onClick={handleChange}>
            Xem danh sách hóa đơn đã xử lý
          </Button>
        ) :
        changeStatus === 1 ? (
          <Button type="dashed" onClick={handleChange}>
          Xem danh sách hoá đơn đã hủy
        </Button>
        )
        :
        (
            <Button type="dashed" onClick={handleChange}>
            Xem danh sách hóa đơn đang xử lý
          </Button>
        )
      }
      <OrderTable data={changeStatus === 0  ? orderPendingData as any : changeStatus === 1 ? orderActiveData : orderCancelledData}></OrderTable>
    </div>
  );
}
