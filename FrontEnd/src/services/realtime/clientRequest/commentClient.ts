import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import axios from "axios";

export function getCommentbyPost (postId: string): fetcherParams {
    return [`/posts/comments/${postId}`, 'GET', null, ServiceDestination.REALTIME];
}

export const postComment = async (data: any) => {
    return await axios.post(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/comments`,data,{
            headers: {'Content-Type': 'application/json'}
        }
    ).then(response => response.data);
}
export function likeComment(data: any): fetcherParams {
    return [`/posts/comments/likes`, 'POST', data, ServiceDestination.REALTIME];
}