import {DashOutlined, EyeOutlined} from "@ant-design/icons";
import {Button} from "@components/ui/button";
import {Popover, Table, Tag} from "antd";
import {Modal} from "../modal/modal";
import {useState} from "react";
import {toast} from "react-toastify";
import {useUser} from "context/user-context";
import dayjs from "dayjs";
import {User} from "@models/user";
import {MainService} from "@models/main-service";
import {ExtraService} from "@models/extra-service";
import {Promotion} from "@models/promotion";
import {Order, OrderStatus} from "@models/order";
import {Invoice} from "../booking/invoice";
import {UserTooltip} from "../user/user-tooltip";
import {ColumnsType} from "antd/lib/table";
import {changeOrderStatus} from "../../../../services/main/clientRequest/bookingClient";
import Swal from "sweetalert2";

type DataTable = {
    data: any[];
    callback? : () => void;
};

export default function OrderTable({data,callback}: DataTable) {
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [showBill, setShowBill] = useState(false)
    const {currentUser} = useUser();
    console.log("Provider: ", data)
    const showModal = (record: any) => {
        setCurrentRecord(record);
        setShowBill(true)
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

    const handleOrderStatus = ((record: any, status: OrderStatus) => {
        Swal.fire({
            title: status == OrderStatus.ACTIVE? "Bạn sẽ chập nhận đơn hàng này? ": "Bạn sẽ huỷ đơn hàng này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Quay lại"
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(changeOrderStatus(record.id, status), {
                    pending: "Đang xử lý...",
                    success: "Xử lý thành công",
                    error: "Xử lý thất bại"
                }).then(() => {
                    const index = data.findIndex(value => value.id === record.id);
                    data.splice(index, 1);
                    callback?.()
                })
            }
        });

    })
    //Tạo nút xử lý ở bảng ở đây, record chính là 1 row trong table
    const content = (record: Order) => {
        if(record.status === OrderStatus.PENDING) {
            return <div className="flex flex-col">
                <Button
                    className="dark-bg-tab min-w-[130px] self-start border  border-light-line-reply px-4 py-1.5
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
                    onClick={() => handleOrderStatus(record, OrderStatus.ACTIVE)}
                >
                    Chấp nhận
                </Button>
                <Button
                    className="dark-bg-tab min-w-[130px] self-start border  border-light-line-reply px-4 py-1.5
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
                    onClick={() => handleOrderStatus(record, OrderStatus.CANCELLED)}
                >
                    Huỷ
                </Button>
            </div>
        }
        return <div className="flex flex-col">
            <Button
        className="dark-bg-tab min-w-[130px] self-start border  border-light-line-reply px-4 py-1.5
        font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
    >
        Đơn hàng đã được xử lý!
        </Button>
    </div>
    }
    const columns: ColumnsType<any> = [
        {
            title: "Số thứ tự",
            align: 'center',
            width: "10px",
            dataIndex: "rowNumber",
        },
        {
            title: "Khách hàng",
            align: 'center',
            width: "20%",
            className: "text-center",
            dataIndex: "customerUser",
            render: (customerUser: User) => {
                return <UserTooltip avatarCheck={true} {...customerUser}>
                    <div className={"flex justify-center pb-3"}>
                        <div className="text-black font-bold pr-2">Lê Viết Đông</div>
                        <EyeOutlined/>
                    </div>

                </UserTooltip>
            },
        },
        {
            title: "Ngày tạo đơn",
            align: 'center',
            dataIndex: "createDate",
            sorter: (a: any, b: any) => {
                const dateA = new Date(a.startDate).getTime();
                const dateB = new Date(b.startDate).getTime();
                return dateA - dateB;
            },
            render: (createdDate: any) => {
                return dayjs(new Date(createdDate)).format("DD-MM-YYYY");
            },
        },
        // {
        //   title: "Ngày tạo",
        //   dataIndex: "createdDate",
        //   sorter: (a: any, b: any) => {
        //     const dateA = new Date(a.endDate).getTime();
        //     const dateB = new Date(b.endDate).getTime();
        //     return dateA - dateB;
        //   },
        //   render: (createdDate: any) => {
        //     return dayjs(new Date(createdDate)).format("DD-MM-YYYY");
        //   },
        // },
        {
            title: "Dịch vụ chính",
            align: 'center',
            dataIndex: "mainService",
            render: (mainService: MainService) => {
                return mainService.name
            },
        },
        {
            title: "Dịch vụ thêm",
            align: 'center',
            dataIndex: "additionalService",
            render: (additionalService: ExtraService[] | undefined | null) => {
                return additionalService?.reduce((reslut, service, index) => {
                    if (index === 0) {
                        return service.name
                    }
                    if (index == additionalService.length - 1) {
                        return reslut + service.name
                    }
                    return reslut + service.name + ", "
                }, "")
            },
        },
        {
            title: "Khuyến mãi",
            align: 'center',
            dataIndex: "promotion",
            render: (promotion: Promotion) => {
                return promotion.name
            },
        },
        {
            title: "Chi tiết",
            align: 'center',
            dataIndex: "",
            render: (record: Order) => {
                return <Popover
                    placement="bottomLeft"
                    trigger="click"
                    content={""}
                >
                    <Button className="ml-3" onClick={() => {
                        setCurrentRecord(record)
                        setShowBill(true)
                    }}>
                        <EyeOutlined/>
                    </Button>
                </Popover>
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: OrderStatus) => {
                const tagColor = (status === OrderStatus.PENDING ? "green" : status === OrderStatus.ACTIVE ? "yellow" : "red")
                const tagContent = (status === OrderStatus.PENDING ? "Đang chờ xử lý" : status === OrderStatus.ACTIVE ? "Đã chấp nhận" : "Đã hủy");

                // Trả về một thẻ Tag với màu và nội dung tương ứng
                return <Tag color={tagColor}>{tagContent}</Tag>;
            },
        },
        {
            title: "Thao tác",
            dataIndex: "",
            key: "x",
            render: (record: any) => (
                <Popover
                    placement="bottomLeft"
                    trigger="click"
                    content={content(record)}
                >
                    <Button className="ml-3">
                        <DashOutlined/>
                    </Button>
                </Popover>
            ),
        },
    ];

    return (
        <>
            <Modal open={showBill} closeModal={() => setShowBill(false)}
            >
                <Invoice order={currentRecord as Order} isCreate={false}/>
            </Modal>
            <Table columns={columns} dataSource={data} bordered={true}/>
        </>
    );
}
