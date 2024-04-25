import {ResponseSocketType} from "@lib/enum/MessageType";

export type ResponseSocket = {
    type: ResponseSocketType,
    data: any
}