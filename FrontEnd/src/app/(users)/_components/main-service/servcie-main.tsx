import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { Modal } from "../modal/modal";
import { GetAllMainService } from "services/main/clientRequest/service";
import useSWR, {mutate} from "swr";
import { addRowNumber } from "@lib/helper/addRowSerivce";
import { MainService } from "@models/main-service";
import ServiceMainTable from "./mainservice-table";
import { Button, Tabs } from "antd";

import CreateMainServiceForm from "app/(users)/(main-layout)/provider/main-service/create-service";
import * as console from "node:console";


export default function ServiceMain() {
  const { currentUser } = useUser();
  const [changeStatus,setChangeStatus] = useState(false);
  const [mainDataTrue, setMainDataTrue] = useState<MainService[]>([]);
  const [mainDataFalse, setMainDataFalse] = useState<MainService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const {
    data: data,
    isLoading: isLoading,
    error: error2,
  } = useSWR(GetAllMainService(currentUser?.id as string), fetcherWithToken);
  const handleCancel = () => {
    setIsModalOpen(false);
    mutate(GetAllMainService)
  };
  useEffect(() => {
    if (data) {
      setMainDataTrue(
        addRowNumber(
          data.data.filter((value:any) => value.status === true).sort(
            (a: any, b: any) =>
              new Date(b.createDate).getTime() -
              new Date(a.createDate).getTime()
          )
        )
      );
      setMainDataFalse(
        addRowNumber(
          data.data.filter((value:any) => value.status === false).sort(
            (a: any, b: any) =>
              new Date(b.createDate).getTime() -
              new Date(a.createDate).getTime()
          )
        )
      );
    }
  }, [data]);


  const handleChange = () =>{
    setChangeStatus(!changeStatus);
  }
  return (
    <div>
      <Button type="dashed" onClick={showModal}>
        Tạo dịch vụ mới
      </Button>
      {
        !changeStatus ? (
            <Button type="dashed" onClick={handleChange}>
            Xem danh sách không hoạt động
          </Button>
        ) :
        (
            <Button type="dashed" onClick={handleChange}>
            Xem danh sách hoạt động
          </Button>
        )
      }
     
      <Modal
        open={isModalOpen}
        closeModal={handleCancel}
        className="w-1/2 ml-auto"
      >
        <CreateMainServiceForm closeModal={handleCancel} />
      </Modal>
      <ServiceMainTable data={!changeStatus ? mainDataTrue as any : mainDataFalse as any}></ServiceMainTable>
    </div>
  );
}
