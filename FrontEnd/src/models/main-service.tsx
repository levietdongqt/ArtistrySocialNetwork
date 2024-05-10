
import {User} from "@models/user";

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
promotionDTO: any|null ;
status: boolean;
rowNumber?: number;
};

