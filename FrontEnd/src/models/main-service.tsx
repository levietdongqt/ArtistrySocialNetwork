
import {User} from "@models/user";
import {Promotion} from "@models/promotion";

export type MainService = {
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
promotionDTO: Promotion|null ;
status: boolean;
rowNumber?: number;
};

export type EditableData = Extract<
    keyof MainService,'id'| 'name'|'price'|'priceType'|'duration'|'restTime'|'imageUrls'|'description'|'promotionDTO'|'updateDate' >;
export type EditablePromotion = Extract<
    keyof MainService,'id'|'promotionDTO' >;

export type EditableMainServiceData = Pick<MainService, EditableData>;
export type EditablePromotionData = Pick<MainService, EditablePromotion>;