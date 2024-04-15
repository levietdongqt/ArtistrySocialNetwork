'use client'
import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";


export function getCommentByPost (postId: string): fetcherParams {
    return [`/posts/comments/${postId}`, 'GET', null, ServiceDestination.REALTIME];
}

