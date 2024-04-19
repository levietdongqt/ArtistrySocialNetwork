import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function suggestKeyword (keyword: string): fetcherParams {
    return [`/elasticsearch?q=${keyword}`, 'GET', null, ServiceDestination.MAIN];
}

export function updatedHistorySearch (userId: string,keyword: any): fetcherParams {
    return [`/elasticsearch/${userId}/update-history`, 'PUT',keyword, ServiceDestination.MAIN];
}

export function getHistorySearch (userId: string): fetcherParams {
    return [`/elasticsearch/${userId}/get-history`, 'GET',null, ServiceDestination.MAIN];
}

export function getUserSearch (userId :string,keyword: string): fetcherParams {
    return [`/elasticsearch/${userId}/get-users?q=${keyword}`, 'GET', null, ServiceDestination.MAIN];
}

export function getPostSearch (keyword: string): fetcherParams {
    return [`/posts/search-posts?q=${keyword}`, 'GET', null, ServiceDestination.REALTIME];
}

export function getServiceSearch (keyword: string): fetcherParams {
    return [`/elasticsearch/get-services?q=${keyword}`, 'GET', null, ServiceDestination.MAIN];
}




