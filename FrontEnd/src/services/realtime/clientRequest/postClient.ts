
import {fetcherParams, fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import axios from "axios";
import process from "process";
import {getServerSideHeaders} from "@lib/config/ServerHeaderConfig";
import {ConTentType} from "@lib/enum/ConTentType";
/// Dem bai viet
export function getPostsCount (): fetcherParams {
    return ['/posts/count', 'GET', null, ServiceDestination.REALTIME];
}
// lay bai viet theo gioi han get-posts?limit=
export function getPostsLimit (userId?:string,limit?: number,pageIndex?:number): fetcherParams {
    return [`/posts/get-posts/${userId}?limit=${limit}&pageIndex=${pageIndex}`, 'GET', null, ServiceDestination.REALTIME];
}

export function getPostListByPostId(postIds: any): fetcherParams {
    return [`/posts/postIds?ids=${postIds.join(',')}`, 'GET', null, ServiceDestination.REALTIME];
}
export function getPostById(postId: string): fetcherParams {
    return [`/posts/get-post/${postId}`, 'GET', null, ServiceDestination.REALTIME];
}

export function getTotalLikePostById(postId: string): fetcherParams {
    return [`/posts/getTotalLike/${postId}`, 'GET', null, ServiceDestination.REALTIME];
}

