import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import axios from "axios";
/// Dem bai viet
export function getPostsCount (): fetcherParams {
    return ['/posts/count', 'GET', null, ServiceDestination.REALTIME];
}


// lay bai viet theo gioi han get-posts?limit=
export function getPostsLimit (limit: number,offset:number): fetcherParams {
    return [`/posts/get-posts?limit=${limit}&offset=${offset}`, 'GET', null, ServiceDestination.REALTIME];
}

// tạo bài viết
export function postPosts(data: any): fetcherParams {
    return [`/posts/post-create`, 'POST', data, ServiceDestination.REALTIME];
}
export const postPosts1 = async (data: any) => {
    return await axios.post(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/post-create`,data,{
        headers: {'Content-Type': 'application/json'}
        }
    ).then(response => response.data);
}
export function likePosts(data: any): fetcherParams {
    return [`/posts/likes`, 'POST', data, ServiceDestination.REALTIME];
}
export const deletePosts1 = async (postId: string) => {
    return await axios.delete(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/deleteById/${postId}`
    ).then(response => response.data);
}
export function deletePosts(postId: string): fetcherParams {
    return [`/posts/deleteById/${postId}}`, 'DELETE', null, ServiceDestination.REALTIME];
}