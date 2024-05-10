import {DayOfWeek} from "@lib/enum/WorkingDay";
import { User } from "./user";

export type WorkingTime = {
    id: number;
    startDate: Date;
    endDate: Date;
    workingDays: DayOfWeek[];
    status: boolean;
    provider: User;
}
