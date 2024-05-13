import { ExtraService } from "./extra-service";
import { MainService } from "./main-service";
import { Promotion } from "./promotion";
import { User } from "./user";

export type OrderDTO = {
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