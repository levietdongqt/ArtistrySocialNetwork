import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { Modal } from "../modal/modal";
import useSWR from "swr";
import { addRowNumber } from "@lib/helper/addRowSerivce";
import { MainService } from "@models/main-service";
import ServiceMainTable from "./mainservice-table";
import { Button, Tabs } from "antd";
import CreateMainServiceForm from "app/(users)/(main-layout)/provider/main-service/create-service";
import { getAllPromotions} from "services/main/clientRequest/promotion";
import PromotionsTable from "./promotions-table";
import CreatePromotionsForm from "./create-promotions";
import { getAllWorkingTimes } from "services/main/clientRequest/working-time";
import WorkingTimesTable from "./working-time-table";
import CreateWorkingTimesForm from "./create-workingtime";
import { WorkingTime } from "@models/workingTime";


export default function WorkingTimes() {
  const { currentUser } = useUser();
  const [changeStatus,setChangeStatus] = useState(false);
  const [mainDataTrue, setMainDataTrue] = useState<WorkingTime[]>([]);
  const [mainDataFalse, setMainDataFalse] = useState<WorkingTime[]>([]);
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
  const {
    data: data,
    isLoading: isLoading,
    error: error2,
  } = useSWR(getAllWorkingTimes(currentUser?.id as string), fetcherWithToken);
  useEffect(() => {
    if (data) {
      setMainDataTrue(
        addRowNumber(
          data.data.filter((value:any) => value.status === true).sort(
            (a: any, b: any) =>
              b.id - a.id
          )
        )
      );
      setMainDataFalse(
        addRowNumber(
          data.data.filter((value:any) => value.status === false)
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
        className="w-1/2 ml-auto mr-auto"
      >
        <CreateWorkingTimesForm array={mainDataTrue} />
      </Modal>
      <WorkingTimesTable data={!changeStatus ? mainDataTrue as any : mainDataFalse as any} trueData={mainDataTrue}></WorkingTimesTable>
    </div>
  );
}
