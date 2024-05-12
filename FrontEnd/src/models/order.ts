import {User} from "@models/user";
import {MainService} from "@models/main-service";
import {Promotion} from "@models/promotion";
import {ExtraService} from "@models/extra-service";

export type Order = {
    id: string;
    status: OrderStatus;
    startDate: Date;
    endDate: Date;
    created: Date;
    updated?: Date;
    providerUser: User;
    customerUser:User;
    mainService: MainService;
    promotion?: Promotion;
    additionalService?: ExtraService;
}

export enum OrderStatus {
    PENDING,
    ACTIVE,
    CANCELLED
}