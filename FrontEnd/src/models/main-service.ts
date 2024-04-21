import {User} from "@models/user";

export  type MainService = {
id: number;
provider : User;
name: string;
price : number;
priceType: string;
duration: number;
restTime: number;
imageUrl: string[];
description: string;
createDate: Date;
updateDate: Date;
status: boolean;
}