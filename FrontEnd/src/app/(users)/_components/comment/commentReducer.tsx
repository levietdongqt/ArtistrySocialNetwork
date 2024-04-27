'use client'
export default function commentsReducer(state:any, action:any) {
    switch (action.type) {
        case 'ADD_REPLIES':
            // Khi nhận comment mới từ WebSocket, thêm vào đầu mảng
            return { comments: [action.payload, ...state.comments] };
        case 'SET_INITIAL_COMMENTS':
            // Khi fetch dữ liệu từ useSWR, thiết lập làm dữ liệu ban đầu
            return { comments: action.payload };
        default:
            throw new Error();
    }
}