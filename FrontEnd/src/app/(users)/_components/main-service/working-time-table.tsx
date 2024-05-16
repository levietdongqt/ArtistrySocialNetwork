import { DashOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import { Popover, Table, Tag, List } from "antd";
import { Modal } from "../modal/modal";
import { useState } from "react";
import CreateWorkingTimesForm from "./create-workingtime";
import { toast } from "react-toastify";
import {
  deleteWorkingTime,
  getAllWorkingTimes,
  reworkWorkingTime,
} from "services/main/clientRequest/working-time";
import { useUser } from "context/user-context";
import { mutate } from "swr";
import dayjs from "dayjs";
import { formatDate } from "@lib/helper/convertTime";

type DataTable = {
  data: any[];
  trueData?: any[]
};

export default function WorkingTimesTable({ data,trueData }: DataTable) {
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const { currentUser } = useUser();
  const showModal = (record: any) => {
    setCurrentRecord(record);
    setIsModalOpen1(true);
  };
  const handleOk = () => {
    setIsModalOpen1(false);
    setCurrentRecord(null);
  };
  const handleCancel = () => {
    console.log("Cancelled");
    setIsModalOpen1(false);
    setCurrentRecord(null);
  };
  const handleDelete = async (value: any) => {
    console.log("data ne", value);
    try {
      await deleteWorkingTime(currentUser?.id as string, value);
      mutate(getAllWorkingTimes);
      toast.success("Xoá thành công");
    } catch (error) {
      console.error("Failed to update working time", error);
      toast.error("Xoá thất bại");
    }
  };

  const handleRework = async (value: any) => {
    var existedStartDates = trueData?.findIndex(
      (date) =>
        (formatDate(new Date(value.startDate)) >=
          formatDate(new Date(date.startDate)) &&
          formatDate(new Date(value.startDate)) <= formatDate(new Date(date.endDate))) && (
          date.id!== value.id
        )
    );
    var existedEndDates = trueData?.findIndex(
      (date) =>
        (formatDate(new Date(value.endDate)) >=
          formatDate(new Date(date.startDate)) &&
          formatDate(new Date(value.endDate)) <= formatDate(new Date(date.endDate))) && (
          date.id!== value.id
        ))
    var existedEndStartDates = trueData?.findIndex(
          (date) => (formatDate(new Date(value.startDate))<= formatDate(new Date(date.startDate)) && formatDate(new Date(value.endDate)) >= formatDate(new Date(date.endDate))) && (date.id!== value.id)
        )
    if (existedStartDates !== -1) {
      toast.error(
        "Lịch đã tồn tại hoặc nằm trong khoảng thời gian đã có.Vui lòng cập nhật lại giờ nếu muốn hồi lại lịch"
      );
      return;
    }
    if (existedEndDates !== -1) {
      toast.error(
        "Lịch đã tồn tại hoặc nằm trong khoảng thời gian đã có.Vui lòng cập nhật lại giờ nếu muốn hồi lại lịch"
      );
      return;
    }
    if (existedEndStartDates !== -1) {
      toast.error(
        "Lịch đã tồn tại hoặc nằm trong khoảng thời gian đã có.Vui lòng cập nhật lại giờ nếu muốn hồi lại lịch"
      );
      return;
    }
    try {
      await reworkWorkingTime(currentUser?.id as string, value.id);
      mutate(getAllWorkingTimes);
      toast.success("Hồi lại thành công");
    } catch (error) {
      console.error("Failed to update working time", error);
      toast.error("Hồi lại thất bại");
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
      {record.status && (
        <Button
          className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
          onClick={() => handleDelete(record.id)}
        >
          Xóa lịch
        </Button>
      )}
      {!record.status && (
        <Button
          className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
          onClick={() => handleRework(record)}
        >
          Hồi lại lịch
        </Button>
      )}
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
        return dayjs(new Date(startDate)).format("DD-MM-YYYY");
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.endDate).getTime();
        const dateB = new Date(b.endDate).getTime();
        return dateA - dateB;
      },
      render: (endDate: any) => {
        return dayjs(new Date(endDate)).format("DD-MM-YYYY");
      },
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "startDate",
      render: (startDate: any) => {
        return dayjs(new Date(startDate)).format("HH:mm");
      },
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "endDate",
      render: (endDate: any) => {
        return dayjs(new Date(endDate)).format("HH:mm");
      },
    },
    {
      title: "Ngày làm việc trong tuần",
      dataIndex: "workingDays",
      render: (workingDays: any) => {
        return (
          <div className="flex flex-col">
            {workingDays.map((day: any, index: number) => (
              <List key={index}>
                <Tag color={"red"}>{day}</Tag>
              </List>
            ))}
          </div>
        );
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
      onFilter: (value: any, record: any) => record.workingDays.includes(value),
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
        <CreateWorkingTimesForm
          data={currentRecord}
          array={data.filter((value: any) => value.status === true)}
        />
      </Modal>
    </>
  );
}
