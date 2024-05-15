'use client'
import axiosWithToken from "@lib/config/AxiosConfig";
import {AxiosRequestConfig} from "axios";
import {MyResponse} from "@models/responseObject";
import {ConversationDto} from "@models/conversation";
import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function getConversationByUserId(): fetcherParams {
    return [`/conversation/by-user`, 'GET', null, ServiceDestination.REALTIME];
}

export async function findUnReadConversations() {
    const fullUrl = `${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/conversation/un-read`
    const config: AxiosRequestConfig = {
        data: null,
        url: fullUrl,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function findConversationById(id: string): Promise<MyResponse<ConversationDto>> {
    const fullUrl = `${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/conversation/${id}`
    const config: AxiosRequestConfig = {
        data: null,
        url: fullUrl,
        method: 'GET',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function sendUpdateConversation(conversation: ConversationDto): Promise<MyResponse<null>> {
    console.log("UPDATE CONVERSATION:", conversation)
    const fullUrl = `${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/conversation/update`
    const config: AxiosRequestConfig = {
        data: JSON.stringify(conversation),
        url: fullUrl,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function findConversationByFriendName(search: string) {
    const fullUrl = `${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/conversation/search?search=${search}`
    const config: AxiosRequestConfig = {
        data: null,
        url: fullUrl,
        method: 'GET',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function createGroup(conversation: any) {
    const fullUrl = `${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/conversation/create-group`
    const config: AxiosRequestConfig = {
        data: JSON.stringify(conversation),
        url: fullUrl,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function deleteConversationAndMessagesBelong(conversation: any) {
    const fullUrl = `${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/conversation/delete`
    const config: AxiosRequestConfig = {
        data: JSON.stringify(conversation),
        url: fullUrl,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function outGroup(conversationId: String) {
    const fullUrl = `${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/conversation/out-group/${conversationId}`
    const config: AxiosRequestConfig = {
        url: fullUrl,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function checkConversation(body: string) {
    const fullUrl = `${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/conversation/check`
    const config: AxiosRequestConfig = {
        url: fullUrl,
        data: body,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}
export function isFollowing(body: any): fetcherParams {
    return [`/friends/isFollow-isFriend`, 'POST', body, ServiceDestination.MAIN];
}