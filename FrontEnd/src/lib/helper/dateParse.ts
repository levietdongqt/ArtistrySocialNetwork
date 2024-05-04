export function dateParse(key: any, value: any) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}.*/; // Regex để kiểm tra định dạng ngày giờ ISO 8601
    if (typeof value === "string" && dateRegex.test(value)) {
        return new Date(value);
    }
    return value; // Trả về giá trị không đổi nếu không phải là chuỗi ngày tháng
}

export function handleFormatDurationSendTime(duration : number) {
    if (duration < 0) return "Invalid Date";

    const millisecondsPerMinute = 60 * 1000;
    const millisecondsPerHour = 60 * millisecondsPerMinute;
    const millisecondsPerDay = 24 * millisecondsPerHour;
    const millisecondsPerMonth = 30 * millisecondsPerDay;

    if (duration < millisecondsPerHour) {
        const minutes = Math.floor(duration / millisecondsPerMinute);
        return `${minutes} phút`;
    } else if (duration < millisecondsPerDay) {
        const hours = Math.floor(duration / millisecondsPerHour);
        return `${hours} giờ`;
    } else if (duration < millisecondsPerMonth) {
        const days = Math.floor(duration / millisecondsPerDay);
        return `${days} ngày`;
    } else {
        const months = Math.floor(duration / millisecondsPerMonth);
        return `${months} tháng`;
    }
}