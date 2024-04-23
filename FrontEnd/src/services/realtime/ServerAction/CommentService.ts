'use server'
import process from "process";
import {getServerSideHeaders} from "@lib/config/ServerHeaderConfig";
import {ConTentType} from "@lib/enum/ConTentType";

export async function likeComment(data: any): Promise<any> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/comments/likes`,
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
export async function postComment(data: any): Promise<any> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/comments`,
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
export async function deleteComment(commentId: string): Promise<any> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/posts/comments/delete/${commentId}`,
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