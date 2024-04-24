'use server'
import process from "process";
import {getServerSideHeaders} from "@lib/config/ServerHeaderConfig";
import {ConTentType} from "@lib/enum/ConTentType";

export async function postPosts1(data: any): Promise<any> {
    try {
        // console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/post-create`,
            {
                method: 'POST',
                headers: await getServerSideHeaders(true, ConTentType.JSON),
                body: JSON.stringify(data),
                cache: "no-cache"
            });
        if (res.ok) {
            const data = await res.json();
            console.log("show data",data);
            return data;
        } else {
            console.log("SAI ROI", res.statusText, res.status)
            return null;
        }
    } catch (error) {
        console.log(error)
    }
}

export async function deletePosts1(postId: string): Promise<any> {
    try {
        // console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/deleteById/${postId}`,
            {
                method: 'DELETE',
                headers: await getServerSideHeaders(true, ConTentType.JSON),
                cache: "no-cache"
            });
        if (res.ok) {
            const data = await res.json();
            console.log("show data",data);
            return data;
        } else {
            console.log("SAI ROI", res.statusText, res.status)
            return null;
        }
    } catch (error) {
        console.log(error)
    }
}

export async function likePosts(data: any): Promise<any> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/likes`,
            {
                method: 'POST',
                headers: await getServerSideHeaders(true, ConTentType.JSON),
                body: JSON.stringify(data),
                cache: "no-cache"
            });
        if (res.ok) {
            const data = await res.json();
            console.log("show data",data);
            return data;
        } else {
            console.log("SAI ROI", res.statusText, res.status)
            return null;
        }
    } catch (error) {
        console.log(error)
    }
}