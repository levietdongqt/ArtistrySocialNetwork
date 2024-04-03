import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function getPosts (limit: number): fetcherParams {
    return [`/posts/get-posts?limit=${limit}`, 'GET', null, ServiceDestination.REALTIME];
}

export function getPostsCount (): fetcherParams {
    return [`/posts/get-posts/count`, 'GET', null, ServiceDestination.REALTIME];
}