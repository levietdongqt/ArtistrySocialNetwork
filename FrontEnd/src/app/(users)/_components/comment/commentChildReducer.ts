'use client'
export default function commentsChildReducer(state:any, action:any) {
    switch (action.type) {
        case 'ADD_COMMENT':
            // Khi nhận comment mới từ WebSocket, thêm vào đầu mảng
            return { comments: [action.payload, ...state.comments] };
        case 'SET_INITIAL':
            // Khi fetch dữ liệu từ useSWR, thiết lập làm dữ liệu ban đầu
            return { comments: action.payload };
        default:
            throw new Error();
    }

}

