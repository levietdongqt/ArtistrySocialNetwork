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