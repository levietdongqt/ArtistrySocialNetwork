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

export function deleteHistorySearch (userId: string,body: any): fetcherParams {
    return [`/elasticsearch/${userId}/delete-history`, 'POST',body, ServiceDestination.MAIN];
}

export function deleteAllHistorySearch (userId: string): fetcherParams {
    return [`/elasticsearch/${userId}/delete-all-history`, 'POST',null, ServiceDestination.MAIN];
}


export function getUserSearch (userId :string,body: any[]): fetcherParams {
    return [`/elasticsearch/${userId}/get-users`, 'POST', body, ServiceDestination.MAIN];
}

export function getPostSearch (body: any[]): fetcherParams {
    return [`/posts/search-posts`, 'POST', body, ServiceDestination.REALTIME];
}

export function getServiceSearch (body: any[]): fetcherParams {
    return [`/elasticsearch/get-services`, 'POST', body, ServiceDestination.MAIN];
}




