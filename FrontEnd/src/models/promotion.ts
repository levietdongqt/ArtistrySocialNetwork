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
