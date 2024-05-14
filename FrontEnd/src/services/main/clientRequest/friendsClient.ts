'use client'
import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import axiosWithToken from "@lib/config/AxiosConfig";
import {AxiosRequestConfig} from "axios";


export function acceptFriend(body: any): fetcherParams {
    return [`/friends/acceptFriend`, 'POST', body, ServiceDestination.MAIN];
}

export function addFriend (body: any): fetcherParams {
    return [`/friends/addFriend`, 'POST', body, ServiceDestination.MAIN];
}

export function returnAddFriend (body: any): fetcherParams {
    return [`/friends/return-addFriend`, 'POST', body, ServiceDestination.MAIN];
}

export function getPendingFriend (userId: string): fetcherParams {
    return [`/friends/pending/${userId}`, 'GET', null, ServiceDestination.MAIN];
}

export function getFriendByUserId (userId: string): fetcherParams {
    return [`/friends/is-friend/${userId}`, 'GET', null, ServiceDestination.MAIN];
}

export function unAcceptFriend(body: any): fetcherParams {
    return [`/friends/unAcceptFriend`, 'POST', body, ServiceDestination.MAIN];
}

export async function findFriend(search: string) {
    const fullUrl = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/friends/search-by-name?search=${search}`
    const config: AxiosRequestConfig = {
        data: null,
        url: fullUrl,
        method: 'GET',
    };
    const response = await axiosWithToken(config);
    return response.data;
}
export function isFollowing (body: any): fetcherParams {
    return [`/friends/isFollow-isFriend`, 'POST', body, ServiceDestination.MAIN];
}


export function followingFriend (body: any): fetcherParams {
    return [`/friends/followFriend`, 'POST', body, ServiceDestination.MAIN];
}

export function removeFriend (body: any): fetcherParams {
    return [`/friends/removeFriend`, 'POST', body, ServiceDestination.MAIN];
}

export function unFollowingFriend (body: any): fetcherParams {
    return [`/friends/unFollowFriend`, 'POST', body, ServiceDestination.MAIN];
}

export function isCheckFriend (body: any): fetcherParams {
    return [`/friends/is-checked`, 'POST', body, ServiceDestination.MAIN];
}


