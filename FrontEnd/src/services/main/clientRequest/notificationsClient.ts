import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import { NopeNotificationModel } from "@models/notifications";

export function getUnreadNotifications (userId :string): fetcherParams {
    return [`/notifications/${userId}`, 'GET', null, ServiceDestination.REALTIME];
}

export function getAllNotifications (userId :string): fetcherParams {
    return [`/notifications/${userId}/all`, 'GET', null, ServiceDestination.REALTIME];
}

export function updateNotification (notificationId: string): fetcherParams {
    return [`/notifications/update/${notificationId}`, 'PUT', null, ServiceDestination.REALTIME];
}

export function deleteNotification (notificationId: string): fetcherParams {
    return [`/notifications/delete/${notificationId}`, 'DELETE', null, ServiceDestination.REALTIME];
}

export function updateListNotification (listId: any[]): fetcherParams {
    return [`/notifications/list-update`, 'PUT', listId, ServiceDestination.REALTIME];
}

export function updateAllNotification (body: any[]): fetcherParams {
    return [`/notifications/update-all`, 'POST', body, ServiceDestination.REALTIME];
}

export function countUnreadNotifications (userId :string): fetcherParams {
    return [`/notifications/${userId}/count-notifications`, 'GET', null, ServiceDestination.REALTIME];
}
export function updateDeliveryNotification (userId :string): fetcherParams {
    return [`/notifications/${userId}/change-delivery`, 'POST', null, ServiceDestination.REALTIME];
}

export function checkNopeNotifications (userId :string, body: any): fetcherParams {
    return [`/notifications/${userId}/check-nope-notifications`, 'POST', body, ServiceDestination.REALTIME];
}

export function saveNopeNotifications (userId :string, body: NopeNotificationModel): fetcherParams {
    return [`/notifications/${userId}/nope-notifications`, 'POST', body, ServiceDestination.REALTIME];
}

export function deleteNopeNotifications (userId :string, body: NopeNotificationModel): fetcherParams {
    return [`/notifications/${userId}/delete-nope-notifications`, 'POST', body, ServiceDestination.REALTIME];
}


