import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function suggestKeyword (keyword: string): fetcherParams {
    return [`/elasticsearch?q=${keyword}`, 'GET', null, ServiceDestination.MAIN];
}
