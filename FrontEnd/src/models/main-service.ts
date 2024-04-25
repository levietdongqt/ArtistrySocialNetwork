import {User} from "@models/user";
import {Promotion} from "@models/promotion";

export  type MainService = {
id: number|null;
provider : User|null;
name: string;
price : number;
priceType: string;
duration: number;
restTime: number;
imageUrl: string[];
description: string;
createDate: Date;
updateDate: Date;
promotionId: number|null ;
status: boolean;
}

export const fieldMainService = [
    {
        title: 'Số thứ tự',
        dataIndex: 'id',
    },
    {
        title: 'Tên Dịch Vụ',
        dataIndex: 'name',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
    },
    {
        title: 'Thời gian',
        dataIndex: 'duration',
    },
    {
        title: 'Thời gian giản cách',
        dataIndex: 'restTime',
    },
    {
        title: 'Kiểu Giá',
        dataIndex: 'imageUrl',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
    },
    {
        title: 'Ngày Tạo',
        dataIndex: 'createDate',
    },
    {
        title: 'Khuyến mãi',
        dataIndex: 'promotion',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
    },
]