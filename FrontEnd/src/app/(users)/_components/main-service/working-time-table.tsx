import { DashOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import { Popover, Table, Tag,List } from "antd";
import { Modal } from "../modal/modal";
import { useState } from "react";
import CreateWorkingTimesForm from "./create-workingtime";
import { toast } from "react-toastify";
import { deleteWorkingTime, getAllWorkingTimes, reworkWorkingTime } from "services/main/clientRequest/working-time";
import { useUser } from "context/user-context";
import { mutate } from "swr";

type DataTable = {
  data: any[];
};

export default function WorkingTimesTable({ data }: DataTable) {
  
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const {currentUser} = useUser();
  const showModal = (record: any) => {
    setCurrentRecord(record);
    setIsModalOpen1(true);
  };
  const handleOk = () => {
    setIsModalOpen1(false);
    setCurrentRecord(null);
  };
  const handleCancel = () => {
    console.log("Cancelled")
    setIsModalOpen1(false);
    setCurrentRecord(null);
  };
  const handleDelete = async (value: any) => {
    console.log("data ne", value);
    try {
      await deleteWorkingTime(currentUser?.id as string,value);
      mutate(getAllWorkingTimes);
      toast.success("Xoá thành công")
  } catch (error) {   
      console.error("Failed to update working time", error);
      toast.error("Xoá thất bại")
  }
  };

  const handleRework = async (value: any) => {
    console.log("data ne", value);
    try {
      await reworkWorkingTime(currentUser?.id as string,value);
      mutate(getAllWorkingTimes);
      toast.success("Hồi lại thành công")
  } catch (error) {   
      console.error("Failed to update working time", error);
      toast.error("Hồi lại thất bại")
  }
  };

  const content = (record: any) => (
    <div className="flex flex-col">
      
      <Button
        className="dark-bg-tab min-w-[130px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={() => showModal(record)}
      >
        Chỉnh sửa
      </Button>
      {
        record.status && (
          <Button
        className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={() => handleDelete(record.id)}
      >
        Xóa lịch
      </Button>
        )
      }
      {
        !record.status &&<Button
        className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={() => handleRework(record.id)}
      >
        Hồi lại lịch
      </Button>
      }
      
    </div>
  );
  const columns: any = [
    {
      title: "Số thứ tự",
      dataIndex: "rowNumber",
    },
    {
      title: "Ngày Bắt đầu",
      dataIndex: "startDate",
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
      },
      render: (startDate: any) => {
        return new Date(startDate).toLocaleDateString();
      },
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "startDate",
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
      },
      render: (startDate: any) => {
        return new Date(startDate).toLocaleTimeString();
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
      },
      render: (startDate: any) => {
        return new Date(startDate).toLocaleDateString();
      },
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "endDate",
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
      },
      render: (startDate: any) => {
        return new Date(startDate).toLocaleTimeString();
      },
    },
    {
      title: "Ngày làm việc trong tuần",
      dataIndex: "workingDays",
      render: (workingDays: any) => {
        return (
          <div className="flex flex-col">
            {
              (workingDays.map((day:any,index:number) =>
                <List>
                   <Tag color={"red"}>{day}</Tag>
                </List>
              ))
            }
          </div>
        )
      },
      filters: [
        {
          text: "Thứ hai",
          value: "MONDAY",
        },
        {
          text: "Thứ ba",
          value: "TUESDAY",
        },
        {
          text: "Thứ tư",
          value: "WEDNESDAY",
        },
        {
          text: "Thứ năm",
          value: "THURSDAY",
        },
        {
          text: "Thứ sáu",
          value: "FRIDAY",
        },
        {
          text: "Thứ bảy",
          value: "SATURDAY",
        },
        {
          text: "Chủ nhật",
          value: "SUNDAY",
        },
      ],
      onFilter: (value: any, record: any) => record.workingDays.includes(value)
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: boolean) => {
        const tagColor = status ? "green" : "red";
        const tagContent = status ? "Hoạt động" : "Không hoạt động";

        // Trả về một thẻ Tag với màu và nội dung tương ứng
        return <Tag color={tagColor}>{tagContent}</Tag>;
      },
    },
    {
      title: "Công cụ",
      dataIndex: "",
      key: "x",
      render: (record: any) => (
        <Popover
          placement="bottomLeft"
          trigger="click"
          content={content(record)}
        >
          <Button className="ml-3">
            <DashOutlined />
          </Button>
        </Popover>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} />
      <Modal
        open={isModalOpen1}
        closeModal={handleCancel}
        className="w-1/2 ml-auto mr-auto"
      >
        <CreateWorkingTimesForm data={currentRecord} />
      </Modal>
    </>
  );
}
