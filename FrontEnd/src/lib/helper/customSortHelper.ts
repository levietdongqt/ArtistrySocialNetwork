import { DayOfWeek } from "@lib/enum/WorkingDay";


 export const customSortDayOfWeek = (a: DayOfWeek, b: DayOfWeek): number => {
    const orderA = Object.values(DayOfWeek).indexOf(a);
    const orderB = Object.values(DayOfWeek).indexOf(b);
    return orderA - orderB
 }
