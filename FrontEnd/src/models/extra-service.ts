import {User} from "@models/user";

export  type ExtraService = {
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