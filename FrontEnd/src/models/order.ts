import {User} from "@models/user";
import {MainService} from "@models/main-service";
import {Promotion} from "@models/promotion";
import {ExtraService} from "@models/extra-service";

export type Order = {
    id?: string;
    status: OrderStatus;
    startDate: Date;
    endDate: Date;
    createDate: Date;
    updated?: Date;
    providerUser: User;
    customerUser:User;
    mainService: MainService;
    amount?: number;
    metaData: any;
    totalPrice?: number;
    promotion?: Promotion | null;
    additionalService?: ExtraService[];
}

export enum OrderStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED"
}