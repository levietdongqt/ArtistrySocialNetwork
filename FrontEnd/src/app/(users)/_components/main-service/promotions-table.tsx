import { DashOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import { Popover, Table, Tag } from "antd";
import { Modal } from "../modal/modal";
import { useState } from "react";
import CreatePromotionsForm from "./create-promotions";
import { useUser } from "context/user-context";
import { deletePromotion, getAllPromotions, reworkPromotion } from "services/main/clientRequest/promotion";
import { mutate } from "swr";
import { toast } from "react-toastify";

type DataTable = {
  data: any[];
};

export default function PromotionsTable({ data }: DataTable) {
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
    console.log("Cancelled");
    setIsModalOpen1(false);
    setCurrentRecord(null);
  };
  const handleTest = (value: any) => {
    console.log("data ne", value);
  };

  const handleDelete = async (value: any) => {
    console.log("data ne", value);
    try {
      await deletePromotion(currentUser?.id as string,value);
      mutate(getAllPromotions);
      toast.success("Xoá thành công")
  } catch (error) {   
      console.error("Failed to update working time", error);
      toast.error("Xoá thất bại")
  }
  };

  const handleRework = async (value: any) => {
    console.log("data ne", value);
    try {
      await reworkPromotion(currentUser?.id as string,value);
      mutate(getAllPromotions);
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

      <Button
        className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={() => handleTest(record.id)}
      >
        Chi tiết Khuyến mãi
      </Button>
      {
        record.status && (
          <Button
        className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={() => handleDelete(record.id)}
      >
        Xóa khuyến mãi
      </Button>
        )
      }
      {
        !record.status &&<Button
        className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={() => handleRework(record.id)}
      >
        Hồi lại khuyến mãi
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
      title: "Tên Khuyến mãi",
      dataIndex: "name",
    },
    {
      title: "Phần trăm giảm giá",
      dataIndex: "discountPercent",
      sorter: (a: any, b: any) => a.discountPercent - b.discountPercent,
      render: (discountPercent: any) => {
        return discountPercent + "%";
      },
    },
    {
      title: "Thời gian bắt đầu",
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
      title: "Thời gian kết thúc",
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
      title: "Kiểu giảm giá",
      dataIndex: "type",
      render: (type: string) => {
        const tagType =
          type === "FOR_SERVICE" ? "Áp dụng Dịch vụ" : "Áp dụng Hóa đơn";

        return <Tag>{tagType}</Tag>;
      },
      filters: [
        {
          text: "Áp dụng cho dịch vụ",
          value: "FOR_SERVICE",
        },
        {
          text: "Áp dụng cho hóa đơn",
          value: "FOR_ORDER",
        },
      ],
      onFilter: (value: any, record: any) => record.type.indexOf(value) === 0,
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
        <CreatePromotionsForm data={currentRecord} />
      </Modal>
    </>
  );
}
