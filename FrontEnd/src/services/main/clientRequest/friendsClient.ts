import { fetcherParams } from "@lib/config/SwrFetcherConfig";
import { ServiceDestination } from "@lib/enum/ServiceDestination";


export function acceptFriend (body: any): fetcherParams {
    return [`/friends/acceptFriend`, 'POST', body, ServiceDestination.MAIN];
}


export function unAcceptFriend (body: any): fetcherParams {
    return [`/friends/unAcceptFriend`, 'POST', body, ServiceDestination.MAIN];
}