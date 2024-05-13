import { DashOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import { Popover, Table, Tag, List } from "antd";
import { Modal } from "../modal/modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "context/user-context";
import { mutate } from "swr";
import dayjs from "dayjs";
import { formatDate } from "@lib/helper/convertTime";
import { User } from "@models/user";
import { MainService } from "@models/main-service";
import { ExtraService } from "@models/extra-service";
import { Promotion } from "@models/promotion";
import { OrderStatus } from "@models/order";

type DataTable = {
  data: any[];
};

export default function OrderTable({data}: DataTable) {
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
    setIsModalOpen1(false);
    setCurrentRecord(null);
  };
  const handleDelete = async (value: any) => {
    console.log("data ne", value);
    try {
      //Xử lý chuyển status hóa đơn ở đây
    } catch (error) {
      console.error("Failed to update working time", error);
      toast.error("Xoá thất bại");
    }
  };

  
  //Tạo nút xử lý ở bảng ở đây, record chính là 1 row trong table
  const content = (record: any) => (
    <div className="flex flex-col">
      <Button
        className="dark-bg-tab min-w-[130px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={() => showModal(record)}
      >
        Chỉnh sửa
      </Button>
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
      title: "Khách hàng",
      dataIndex: "customerUser",
      render: (customerUser: User) => {
        return customerUser.fullName
      },
    },
    {
      title: "Dịch vụ chính",
      dataIndex: "mainService",
      render: (mainService: MainService) => {
        return mainService.name
      },
    },
    {
      title: "Dịch vụ thêm",
      dataIndex: "additionalService",
      render: (additionalService: ExtraService) => {
        return additionalService.name
      },
    },
    {
      title: "Khuyến mãi",
      dataIndex: "promotion",
      render: (promotion: Promotion) => {
        return promotion.name
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: OrderStatus) => {
        const tagColor = (status === OrderStatus.PENDING ? "green" : status === OrderStatus.ACTIVE ? "yellow" : "red")
        const tagContent =  (status === OrderStatus.PENDING ? "Đang chờ xử lý" : status === OrderStatus.ACTIVE ? "Đã xử lý" : "Đã hủy");

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
    </>
  );
}
