import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

/// Dem bai viet
export function getPostsCount (): fetcherParams {
    return ['/posts/count', 'GET', null, ServiceDestination.REALTIME];
}


// lay bai viet theo gioi han get-posts?limit=
export function getPostsLimit (limit: number): fetcherParams {
    return [`/posts/get-posts?limit=${limit}`, 'GET', null, ServiceDestination.REALTIME];
}

// tạo bài viết
export function postPosts(data: any): fetcherParams {
    console.log("show: ", data);
    return [`/posts/post-create`, 'POST', data, ServiceDestination.REALTIME];
}
