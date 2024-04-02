import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function getTest (body: any): fetcherParams {
    return ['/auth/hello', 'GET', body, ServiceDestination.MAIN];
}