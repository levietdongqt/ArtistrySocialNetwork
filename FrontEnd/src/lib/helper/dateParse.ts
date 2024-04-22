export function dateParse(key: any, value: any) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}.*/; // Regex để kiểm tra định dạng ngày giờ ISO 8601
    if (typeof value === "string" && dateRegex.test(value)) {
        return new Date(value);
    }
    return value; // Trả về giá trị không đổi nếu không phải là chuỗi ngày tháng
}