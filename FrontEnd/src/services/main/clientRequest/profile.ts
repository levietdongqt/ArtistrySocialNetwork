


import {MainService} from "@models/main-service";
import {ExtraService} from "@models/extra-service";
import {Review} from "@models/review";
import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";


// // Function to get Main Services.
// export function getMainServices(body?: MainService): fetcherParams {
//     return ['/mainServices', 'GET', body, ServiceDestination.MAIN];
// }
//
// // Function to get Extra Services.
// export function getExtraServices(body?: ExtraService): fetcherParams {
//     return ['/extraServices', 'GET', body, ServiceDestination.MAIN];
// }
//
// // Function to get Reviews.
// export function getReviews(body?: Review): fetcherParams {
//     return ['/reviews', 'GET', body, ServiceDestination.MAIN];
// }

import axios from 'axios';

// Function to get Main Services for development.
export async function getMainServices(body?: MainService) {
    const url = 'http://localhost:5000/mainServices';
    try {
        const response = await axios.get(url, { params: body });
        return response.data;
    } catch (error) {
        // Handle error appropriately
        console.error('Error fetching Main Services:', error);
        throw error;
    }
}

// Function to get Extra Services for development.
export async function getExtraServices(body?: ExtraService) {
    const url = 'http://localhost:5000/extraServices';
    try {
        const response = await axios.get(url, { params: body });
        return response.data;
    } catch (error) {
        // Handle error appropriately
        console.error('Error fetching Extra Services:', error);
        throw error;
    }
}

// Function to get Reviews for development.
export async function getReviews(body?: Review) {
    const url = 'http://localhost:5000/reviews';
    try {
        const response = await axios.get(url, { params: body });
        return response.data;
    } catch (error) {
        // Handle error appropriately
        console.error('Error fetching Reviews:', error);
        throw error;
    }
}