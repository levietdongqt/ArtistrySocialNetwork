
import axios, {AxiosRequestConfig} from "axios";
import {District, Province, Ward} from "@models/address";


const API_BASE_URL = 'https://vapi.vnappmob.com/api';

export const getAllProvinces = async (): Promise<Province[]> => {
    const response = await axios.get(`${API_BASE_URL}/province`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    if (response.status === 200) {
        return response.data.results;
    }
    throw new Error('Error fetching provinces');
};

export const getAllDistricts = async (provinceId: string): Promise<District[]> => {
    const response = await axios.get(`${API_BASE_URL}/province/district/${provinceId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    if (response.status === 200) {
        return response.data.results;
    }
    throw new Error('Error fetching districts');
};

export const getAllWards = async (districtId: string): Promise<Ward[]> => {
    const response = await axios.get(`${API_BASE_URL}/province/ward/${districtId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    if (response.status === 200) {
        return response.data.results;
    }
    throw new Error('Error fetching wards');
};