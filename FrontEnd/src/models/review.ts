import {JsonObject} from "type-fest";
import {User} from "@models/user";

// Review type with reviewDetails as a nested object
export type Review = {
    id: number| null;
    customerUser: User;
    providerUser: User;
    reviewDetails: ReviewDetails;
}

// Review details type definition
export type ReviewDetails = {
    STAR: number;
    CONTENT: string;
    ADDITIONAL_CONTENT: string;
    CREATE_DATE: string;
    MAIN_SERVICE_ID: number|null;
    SERVICE_NAME: string;
    LIKE_NUMBER: number;
    IS_HAVE_ORDER: boolean;
}