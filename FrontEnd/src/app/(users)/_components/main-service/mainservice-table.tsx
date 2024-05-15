'use client'
import { DashOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import { Popover, Table, Tag, Carousel, Image } from "antd";
import { Modal } from "../modal/modal";
import { useState } from "react";
import {MainService} from "@models/main-service";
import UpdateMainService from "../../(main-layout)/provider/main-service/update-service";
import {deletePromotion, getAllPromotions, reworkPromotion} from "../../../../services/main/clientRequest/promotion";
import {mutate} from "swr";
import {toast} from "react-toastify";
import {
  createExtraService,
  GetMainServiceById,
  updateStatusMainService
} from "../../../../services/main/clientRequest/service";

type DataTable = {
  data: MainService[];
};
const contentStyle = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export default function ServiceMainTable({ data }: DataTable) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<any>();


  const handleCancel = () => {
    console.log("Cancelled");
    //setEditingServiceId(null);
    setUpdateModalVisible(false);
    mutate(GetMainServiceById)
  };

  // Người dùng nhấn vào "Chỉnh sửa"
  const handleEditClick = (record: any) => {
   
    // console.log('serviceId', data.serviceId);
    setEditingServiceId(record);
    setUpdateModalVisible(true);
   
  };

  const handleTest = (value: any) => {
  };


  const handleDelete = async (value: any) => {
    console.log("data ne", value);
    try {
      await updateStatusMainService(value);

      mutate(GetMainServiceById)
      toast.success("Dừng hoạt động dịch vụ thành công")
    } catch (error) {
      console.error("Failed to update working time", error);
      toast.error("Dừng hoạt động dịch vụ thất bại")
    }
  };

  const handleRework = async (value: any) => {
    console.log("data ne", value);
    try {
      await updateStatusMainService(value);
      mutate(GetMainServiceById)
      toast.success(" hoạt động dịch vụ thành công")
    } catch (error) {
      console.error("Failed to update working time", error);
      toast.error(" hoạt động dịch vụ thất bại")
    }
  };

  const content = (record: any) => (
    <div className="flex flex-col">
      <Button
        className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
        onClick={() => handleEditClick(record)}
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
                Dừng hoạt động
              </Button>
          )
      }
      {
          !record.status &&<Button
              className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
              onClick={() => handleRework(record.id)}
          >
            Hoạt động
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
      title: "Tên Dịch Vụ",
      dataIndex: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrls",
      render: (imageUrls: any) => {
        return (
            <div className="rounded-lg overflow-hidden w-20 h-14">
              <Carousel autoplay>
                {imageUrls?.map((img: any, idx: number) => (
                    <div key={idx} className="relative">
                      <Image
                          src={img}
                          alt={`Service Image ${idx + 1}`}
                          style={{
                            width: "100px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                      />
                    </div>
                ))}
              </Carousel>
            </div>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      sorter: (a: any, b: any) => a.duration - b.duration,
      render: (duration: any) => {
        return  duration;
      },
    },
    {
      title: "Thời gian nghỉ",
      dataIndex: "restTime",
      sorter: (a: any, b: any) => a.restTime - b.restTime,
      render: (restTime: any) => {
        return  restTime;
      },
    },
    {
      title: "Kiểu Giá",
      dataIndex: "priceType",
      filters: [
        {
          text: "Concept",
          value: "FOR_SERVICE",
        },
        {
          text: "Khác",
          value: "FOR_ORDER",
        },
        {
          text: "Ngày",
          value: "Ngày",
        },
      ],
      onFilter: (value: any, record: any) =>
        record.priceType.indexOf(value) === 0,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createDate",
      render: (createDate: any) => {
        return new Date(createDate).toLocaleDateString();
      },
      sorter: (a: any, b: any) =>
        new Date(b.createDate).getTime() - new Date(a.createDate).getTime(),
    },
    {
      title: "Khuyến mãi",
      dataIndex: "promotionDTO",
      render: (promotionDTO: { name?: string } | null) => {
        return promotionDTO ? promotionDTO.name : "";  // Hiển thị thông báo nếu không có thông tin khuyến mãi
      },
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
        open={updateModalVisible}
        closeModal={handleCancel}
        className="w-1/2 ml-auto mr-auto"
      >
        <UpdateMainService data={editingServiceId!} closeModal={handleCancel} />
      </Modal>
    </>
  );
}
