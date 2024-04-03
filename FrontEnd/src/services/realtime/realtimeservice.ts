import { getServerSideHeaders } from "@lib/config/ServerHeaderConfig";
import { ConTentType } from "@lib/enum/ConTentType";
import { Post } from "@models/post";
import { MyResponse } from "@models/responseObject";



export async function postNotificationsAPI(): Promise<MyResponse<any>> {
    console.log("Testing........")
    try {
        // console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}/notifications/count-notifications`,
            {
                method: 'GET',
                headers: await getServerSideHeaders(true, ConTentType.JSON),
                cache: "no-cache"
            })
        if (res.ok) {
            const data : MyResponse<any> = await res.json();
            console.log(data)
            return data;
        } else {

            console.log("SAI ROI")

            throw new Error("Something went wrong in login server action");
        }
    } catch (error) {
        throw new Error("Something went wrong in login server action");
        console.log(error)
    }
}