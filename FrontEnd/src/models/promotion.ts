import { User } from "./user";

export type Promotion= {
    id: number;
    name: string;
    discountPercent: number;
    startDate: Date;
    endDate: Date;
    description: string;
    type: PromotionType;
    status: boolean;
    user :User
}

export enum PromotionType {
    FOR_ORDER,
    FOR_SERVICE
}


export const fieldPromotion = [
    {
        title: 'Số thứ tự',
        dataIndex: 'id',
    },
    {
        title: 'Tên Dịch Vụ',
        dataIndex: 'name',
    },
    {
        title: 'Giá Giảm',
        dataIndex: 'discountPercent',
    },
    {
        title: 'Thời gian Bắt Đầu',
        dataIndex: 'startDate',
    },
    {
        title: 'Thời gian Kết Thúc',
        dataIndex: 'endDate',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
    },
    {
        title: 'Kiểu khuyến mãi',
        dataIndex: 'type',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
    },
]