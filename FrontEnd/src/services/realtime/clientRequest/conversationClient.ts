import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function getConversationByUserId (userId: string): fetcherParams {
    return [`/conversation/by-user/${userId}`, 'GET', null, ServiceDestination.REALTIME];
}