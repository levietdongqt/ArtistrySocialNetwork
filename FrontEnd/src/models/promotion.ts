export type Promotion= {
    id?: number;
    name: string;
    discountPercent: number;
    startDate: Date;
    endDate: Date;
    description: string;
    type: PromotionType;
    status: boolean;

}

enum PromotionType {
    FOR_ORDER,
    FOR_SERVICE // Đổi TYPE2 thành lựa chọn thực tế của bạn
    // Thêm thêm các kiểu khuyến mãi bổ sung vào đây nếu cần
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