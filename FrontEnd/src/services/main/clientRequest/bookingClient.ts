import {AxiosRequestConfig} from "axios";
import axiosWithToken from "@lib/config/AxiosConfig";
import {OrderStatus} from "@models/order";

export async function getWorkingTimeByProvider(body: any) {
    const fullUrl = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/booking/get/working-times`
    const config: AxiosRequestConfig = {
        data: body,
        url: fullUrl,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function getOrdersBy(body: any) {
    const fullUrl = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/booking/get/orders-by-date`
    const config: AxiosRequestConfig = {
        data: body,
        url: fullUrl,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export async function changeOrderStatus(orderId: number, status: OrderStatus) {
    let fullUrl;
    if(status === OrderStatus.CANCELLED){
        fullUrl = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/booking/order/cancel/${orderId}`
    }else{
        fullUrl = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/booking/order/accept/${orderId}`
    }
    const config: AxiosRequestConfig = {
        url: fullUrl,
        method: 'POST',
    };
    const response = await axiosWithToken(config);
    return response.data;
}