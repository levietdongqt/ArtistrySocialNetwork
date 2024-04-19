import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";

export function getUnreadNotifications (userId :string): fetcherParams {
    return [`/notifications/${userId}`, 'GET', null, ServiceDestination.REALTIME];
}

export function getAllNotifications (userId :string): fetcherParams {
    return [`/notifications/${userId}/all`, 'GET', null, ServiceDestination.REALTIME];
}

export function updateNotification (notificationId: string): fetcherParams {
    console.log('Updating notification',notificationId);
    return [`/notifications/update/${notificationId}`, 'PUT', null, ServiceDestination.REALTIME];
}

export function countUnreadNotifications (userId :string): fetcherParams {
    return [`/notifications/${userId}/count-notifications`, 'GET', null, ServiceDestination.REALTIME];
}
export function updateDeliveryNotification (userId :string): fetcherParams {
    return [`/notifications/${userId}/change-delivery`, 'POST', null, ServiceDestination.REALTIME];
}

