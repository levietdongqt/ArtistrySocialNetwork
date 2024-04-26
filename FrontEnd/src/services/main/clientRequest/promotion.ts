import { fetcherParams } from "@lib/config/SwrFetcherConfig";
import { ServiceDestination } from "@lib/enum/ServiceDestination";


export function getPromotions (userId: string,status: boolean,expired: boolean): fetcherParams {
    return [`/promotions/${userId}/get-all?status=${status}&isExpired=${expired}`, 'GET',null, ServiceDestination.MAIN];
}