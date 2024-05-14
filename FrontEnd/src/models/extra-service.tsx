import {ProviderData, User} from "@models/user";
import {MainService} from "@models/main-service";

export  type ExtraService = {
    id: number|null;
    provider : User|null;
    name: string;
    price : number;
    priceType: string;
    duration: number;
    restTime: number;
    imageUrls: string[];
    description: string;
    createDate: Date;
    updateDate: Date;
    promotionDTO: any|null ;
    status: boolean;
    rowNumber?: number;
};
export type EditableData = Extract<
    keyof ExtraService,'id'| 'name'|'price'|'priceType'|'duration'|'restTime'|'imageUrls'|'description'|'promotionDTO'|'updateDate' >;
export type EditablePromotion = Extract<
    keyof ExtraService,'id'|'promotionDTO' >;
// export const fieldExtraService = [
//     {
//         title: 'Số thứ tự',
//         dataIndex: 'id',
//     },
//     {
//         title: 'Tên Dịch Vụ',
//         dataIndex: 'name',
//     },
//     {
//         title: 'Giá',
//         dataIndex: 'price',
//     },
//     {
//         title: 'Thời gian',
//         dataIndex: 'duration',
//     },
//     {
//         title: 'Thời gian giản cách',
//         dataIndex: 'restTime',
//     },
//     {
//         title: 'Kiểu Giá',
//         dataIndex: 'imageUrl',
//     },
//     {
//         title: 'Mô tả',
//         dataIndex: 'description',
//     },
//     {
//         title: 'Ngày Tạo',
//         dataIndex: 'createDate',
//     },
//     {
//         title: 'Khuyến mãi',
//         dataIndex: 'promotion',
//     },
//     {
//         title: 'Trạng thái',
//         dataIndex: 'status',
//     },
// ]
export type EditableExtraServiceData = Pick<ExtraService, EditableData>;
export type EditablePromotionData = Pick<ExtraService, EditablePromotion>;