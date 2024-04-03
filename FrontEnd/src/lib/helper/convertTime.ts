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