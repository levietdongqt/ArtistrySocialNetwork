import { DashOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import {Carousel, Image, Popover, Table, Tag} from "antd";
import React, {useState} from "react";
import {ExtraService} from "@models/extra-service";
import {Modal} from "../modal/modal";
import UpdateMainService from "../../(main-layout)/provider/main-service/update-service";
import UpdateExtraService from "../../(main-layout)/provider/extra-service/update-extraservice";
import {
    GetExtraServiceById,
    GetMainServiceById, updateStatusExtraService,
    updateStatusMainService
} from "../../../../services/main/clientRequest/service";
import {mutate} from "swr";
import {toast} from "react-toastify";

type DataTable = {
  data: ExtraService[];
};


export default function ServiceExtraTable({ data }: DataTable) {
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [editingServiceId, setEditingServiceId] = useState<any>();
    const handleCancel = () => {
        setUpdateModalVisible(false);
        mutate(GetExtraServiceById)
    };
    const handleTest = (value: any) => {
        console.log("data ne", value);
    };
    const handleEditClick = (record: any) => {

        // console.log('serviceId', data.serviceId);
        setEditingServiceId(record);
        setUpdateModalVisible(true);
    };
    const handleDelete = async (value: any) => {
        console.log("data ne", value);
        try {
            await updateStatusExtraService(value);

            mutate(GetExtraServiceById)
            toast.success("Dừng hoạt động dịch vụ thành công")
        } catch (error) {
            console.error("Failed to update working time", error);
            toast.error("Dừng hoạt động dịch vụ thất bại")
        }
    };

    const handleRework = async (value: any) => {
        console.log("data ne", value);
        try {
            await updateStatusExtraService(value);
            mutate(GetExtraServiceById)
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
        // {
        //     title: "Hình ảnh",
        //     dataIndex: "imageUrls",
        //     render: (imageUrls: any) => {
        //         return (
        //             <div className="rounded-lg overflow-hidden w-20 h-14">
        //                 <Carousel autoplay>
        //                     {imageUrls?.map((img: any, idx: number) => (
        //                         <div key={idx} className="relative">
        //                             <Image
        //                                 src={img}
        //                                 alt={`Service Image ${idx + 1}`}
        //                                 style={{
        //                                     width: "100px",
        //                                     height: "60px",
        //                                     objectFit: "cover",
        //                                 }}
        //                             />
        //                         </div>
        //                     ))}
        //                 </Carousel>
        //             </div>
        //         );
        //     },
        // },
        {
            title: "Giá",
            dataIndex: "price",
            sorter: (a: any, b: any) => a.price - b.price,
        },
        // {
        //     title: "Thời gian",
        //     dataIndex: "duration",
        //     sorter: (a: any, b: any) => a.duration - b.duration,
        //     render: (duration: any) => {
        //         return duration;
        //     },
        // },
        // {
        //     title: "Thời gian nghỉ",
        //     dataIndex: "restTime",
        //     sorter: (a: any, b: any) => a.restTime - b.restTime,
        //     render: (restTime: any) => {
        //         return restTime;
        //     },
        // },
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
            title: "Action",
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


    return(
        <>
        <Table columns={columns} dataSource={data} />

            <Modal
                open={updateModalVisible}
                closeModal={handleCancel}
                className="w-1/2 ml-auto mr-auto"
            >
                <UpdateExtraService data={editingServiceId!} closeModal={handleCancel} />
            </Modal>
        </>
    );


}
