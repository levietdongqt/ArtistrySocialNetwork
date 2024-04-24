import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function getBookmarksByUserId (userId: string): fetcherParams {
    return [`/bookmark/${userId}`, 'GET', null, ServiceDestination.REALTIME];
}


