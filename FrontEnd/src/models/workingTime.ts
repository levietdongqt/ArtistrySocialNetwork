import {DayOfWeek} from "@lib/enum/WorkingDay";

export type WorkingTime = {
    id: number;
    startDate: Date;
    endDate: Date;
    workingDays: DayOfWeek[];
    status: boolean;
    providerId: string;
}