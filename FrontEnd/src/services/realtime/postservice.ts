import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function getPosts (body: any): fetcherParams {
    return ['/auth/hello2', 'GET', null, ServiceDestination.MAIN];
}