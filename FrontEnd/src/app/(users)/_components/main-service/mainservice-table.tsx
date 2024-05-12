'use client'
import { DashOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import { Modal, Popover, Table, Tag, Carousel, Image } from "antd";
import { useState } from "react";
import UpdateMainService from "../../(main-layout)/provider/main-service/update-service";
import {MainService} from "@models/main-service";

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
  const [editingServiceId, setEditingServiceId] = useState<MainService>();

  // Mở modal shows ảnh grand ắng handling event
  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  // Người dùng nhấn vào "Chỉnh sửa"
  const handleEditClick = (record: MainService) => {
    setEditingServiceId(record);
    // console.log('serviceId', data.serviceId);
    setUpdateModalVisible(true);
  };

  const handleTest = (value: any) => {
    console.log("data ne", value);
  };
  const imageStyle = {
    width: "100px", // Chiều rộng cố định bạn muốn áp dụng
    height: "60px", // Chiều cao cố định bạn muốn áp dụng
    objectFit: "cover" // Sử dụng object-fit để đảm bảo ảnh không bị méo khi thay đổi kích thước
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

      {record.status && (
        <Button
          className="dark-bg-tab min-w-[120px] self-start border  border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
          onClick={() => handleTest(record.id)}
        >
          Áp dụng khuyến mãi
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
        return new Date(duration).toLocaleTimeString();
      },
    },
    {
      title: "Thời gian nghỉ",
      dataIndex: "restTime",
      sorter: (a: any, b: any) => a.restTime - b.restTime,
      render: (restTime: any) => {
        return new Date(restTime).toLocaleTimeString();
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
      dataIndex: "promotion",
      showSorterTooltip: {
        target: "full-header",
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
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedImage && <Image src={selectedImage} />}
      </Modal>
      <Modal
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)} // thay cho closeModal
      >
        {editingServiceId && <UpdateMainService data={editingServiceId}  />}
      </Modal>
    </>
  );
}
