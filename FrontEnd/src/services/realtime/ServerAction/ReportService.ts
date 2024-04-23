'use server'
import process from "process";
import {getServerSideHeaders} from "@lib/config/ServerHeaderConfig";
import {ConTentType} from "@lib/enum/ConTentType";

export async function createReport(data:any): Promise<any> {
    try {
        // console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/reports/createReport`,
            {
                method: 'POST',
                headers: await getServerSideHeaders(true, ConTentType.JSON),
                cache: "no-cache",
                body: JSON.stringify(data)
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

export async function undoReport(userId:string, postId:string): Promise<any> {
    try {
        // console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/reports/undoReport?userId=${userId}&postId=${postId}`,
            {
                method: 'PUT',
                headers: await getServerSideHeaders(true, ConTentType.JSON),
                cache: "no-cache",
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