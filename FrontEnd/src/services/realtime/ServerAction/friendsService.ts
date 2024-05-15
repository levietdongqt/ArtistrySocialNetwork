'use server'
import process from "process";
import {getServerSideHeaders} from "@lib/config/ServerHeaderConfig";
import {ConTentType} from "@lib/enum/ConTentType";

export async function acceptFriend(data: any): Promise<any> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/friends/acceptFriend`,
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

export async function unAcceptFriend(data: any): Promise<any> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/friends/unAcceptFriend`,
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