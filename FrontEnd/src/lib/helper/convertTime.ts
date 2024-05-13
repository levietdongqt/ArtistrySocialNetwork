import { DayOfWeek } from "@lib/enum/WorkingDay";
import dayjs from "dayjs";

 export function formatElapsedTime(milliseconds:number) {
    // Chuyển đổi thời gian từ mili giây thành giây
    var seconds = Math.floor(milliseconds / 1000);
    
    // Kiểm tra nếu quá 24 giờ (86400 giây)
    if (seconds >= 86400) {
        return Math.floor(seconds / 86400) + " ngày trước";
    }
    
    // Kiểm tra nếu quá 60 phút (3600 giây)
    if (seconds >= 3600) {
        return Math.floor(seconds / 3600) + " giờ trước";
    }
    
    // Kiểm tra nếu quá 60 giây
    if (seconds >= 60) {
        return Math.floor(seconds / 60) + " phút trước";
    }
    
    // // Trong trường hợp còn lại, trả về giây
    // return seconds + " giây";
}

export function parseStringToJson(array: string[]){
    var object_array = [];
    for (var i = 0; i < array.length; i++) {
        // Chuyển đổi từng chuỗi JSON thành đối tượng JavaScript
        var object = JSON.parse(array[i]);
        // Thêm đối tượng vào mảng chứa các đối tượng
        object_array.push(object);
    }
    return object_array
}

export function getDatesBetween(startDate: Date, endDate: Date): Set<DayOfWeek> {
    const dates = new Set<DayOfWeek>();
    let currentDate = new Date(startDate);

    while (formatDate(currentDate) <= formatDate(endDate)) {
        dates.add(dayjs(currentDate).format('dddd').toUpperCase() as DayOfWeek)
        currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log("dates",dates);

    return dates;
}

export function getVietnameseDayFromDay(day: DayOfWeek): String {
    switch(day){
        case DayOfWeek.MONDAY:
            return "Thứ hai"
        case DayOfWeek.TUESDAY:
            return "Thứ ba"
        case DayOfWeek.WEDNESDAY:
            return "Thứ tư"
        case DayOfWeek.THURSDAY:
            return "Thứ năm"
        case DayOfWeek.FRIDAY:
            return "Thứ sáu"
        case DayOfWeek.SATURDAY:
            return "Thứ bảy"
        case DayOfWeek.SUNDAY:
            return "Chủ nhật"
    }
}

export function setTimeForDates(date: any,time: any): Date {
    const dateformat = new Date(date);
    const hours = new Date(time).getHours();
    const minutes = new Date(time).getMinutes();
    
    dateformat.setHours(hours);
    dateformat.setMinutes(minutes);
    console.log("dateformat",dateformat);
    return dateformat;
}

export function convertToISODate(date : Date): String {
    console.log("iso1",date);
// Lấy các thành phần ngày tháng năm từ đối tượng Date
const year = date.getUTCFullYear();
const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
const day = ("0" + date.getUTCDate()).slice(-2);
const hours = ("0" + date.getHours()).slice(-2);
const minutes = ("0" + date.getMinutes()).slice(-2);
const seconds = "00"; // Đặt giây là 00
const milliseconds = "000"; // Đặt mili giây là 000

const isoTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
console.log("iso2",isoTimeString);
 return isoTimeString;
}

export function formatDate(date: any): Date {
    const dateformat = new Date(date);
    
    dateformat.setHours(0);
    dateformat.setMinutes(0);
    dateformat.setSeconds(0);
    console.log("dateformat",dateformat);
    return dateformat;
}