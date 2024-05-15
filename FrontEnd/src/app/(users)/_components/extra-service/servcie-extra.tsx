import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { Modal } from "../modal/modal";
import {GetAllExtraService, GetAllMainService, GetExtraServiceById} from "services/main/clientRequest/service";
import useSWR, {mutate} from "swr";
import {addRowNumber} from "@lib/helper/addRowSerivce";
import ServiceMainTable from "./extraservice-table";
import { Button, Tabs } from "antd";
import CreateExtraServiceForm from "../../(main-layout)/provider/extra-service/create-service";
import {ExtraService} from "@models/extra-service";
import ServiceExtraTable from "./extraservice-table";





export default function ServiceExtra() {
  const { currentUser } = useUser();
  const [changeStatus,setChangeStatus] = useState(false);
  const [extraDataTrue, setExtraDataTrue] = useState<ExtraService[]>([]);
  const [extraDataFalse, setExtraDataFalse] = useState<ExtraService[]>([]);
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
  } = useSWR(GetAllExtraService(currentUser?.id as string), fetcherWithToken);

    const handleCancel = () => {
        setIsModalOpen(false);
        mutate(GetAllExtraService)
    };

  useEffect(() => {
    if (data) {
      setExtraDataTrue(
          addRowNumber(
              data.data.filter((value:any) => value.status === true).sort(
                  (a: any, b: any) =>
                      new Date(b.createDate).getTime() -
                      new Date(a.createDate).getTime()

              )
          )

      );
      setExtraDataFalse(
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
    console.log('extradata', data)
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
        <CreateExtraServiceForm closeModal={handleCancel} />
      </Modal>
      <ServiceExtraTable data={!changeStatus ? extraDataTrue as any : extraDataFalse as any}></ServiceExtraTable>
    </div>
  );
}
