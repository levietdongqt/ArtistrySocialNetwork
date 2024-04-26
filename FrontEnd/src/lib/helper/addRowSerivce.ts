import { MainService } from "@models/main-service";

export const addRowNumber = (data: MainService[]) => {
    // Tạo một bản sao của dữ liệu để giữ nguyên trạng gốc
    const newData = [...data];
    // Thêm một cột mới để giữ giá trị số thứ tự tăng dần
    newData.forEach((item, index) => {
        item.rowNumber = index + 1; // Giá trị số thứ tự tăng dần (bắt đầu từ 1)
    });
    return newData;
};