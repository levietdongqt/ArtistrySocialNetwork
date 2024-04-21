import {JsonObject} from "type-fest";

// Review type with reviewDetails as a nested object
export type Review = {
    id: number;
    customerUserId: number;
    providerId: number;
    reviewDetails: ReviewDetails;
}

// Review details type definition
export type ReviewDetails = {
    star: number;
    content: string;
    additionalContent: string;
    createdDate: Date;
    mainServiceId: number;
    serviceName: string;
    likesNumber: number;
    isHaveOrder: boolean;
}