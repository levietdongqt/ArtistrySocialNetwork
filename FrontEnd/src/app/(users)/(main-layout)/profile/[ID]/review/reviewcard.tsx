'use client'
import React from 'react';
import { Rate } from 'antd';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Review } from '@models/review';
import {UserAvatar} from "../../../../_components/user/user-avatar";
import useSWR from "swr";
import {getUserById} from "../../../../../../services/main/clientRequest/userClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {UserTooltip} from "../../../../_components/user/user-tooltip";
import {Modal} from "../../../../_components/modal/modal";
import RegisterProviderForm from "../register-provider";
import CreateReview from "./create-review";



interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const {
        reviewDetails: { CREATE_DATE,CONTENT,ADDITIONAL_CONTENT,MAIN_SERVICE_ID,STAR,SERVICE_NAME },
    } = review;
    const dateObject = new Date(review?.reviewDetails?.CREATE_DATE);
    // console.log('dateObject',review?.reviewDetails.STAR)
    const formattedDate = !isNaN(dateObject.valueOf())
        ? format(dateObject, "MMM do, yyyy")
        : "Invalid Date";

    // Animation variant object for framer-motion
    const variants = {
        hover: {
            scale: 1.05,
            rotate: -1,
            boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.12)",
        }
    };

    return (
        <>

        <motion.div
            whileHover="hover"
            variants={variants}
            transition={{ duration: 0.25 }}
            className="bg-white p-4 rounded-lg shadow-xl space-y-4"
            style={{ perspective: 1000 }} // Apply perspective to get a more pronounced 3D effect
        >
            <div className="flex items-center space-x-4">
                <UserAvatar id={review?.customerUser?.id} src={review?.customerUser?.avatar} alt={review?.customerUser?.fullName ?? ''} username={review?.customerUser?.fullName ?? ''} />

                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{review?.customerUser?.fullName}</span>
                    <Rate disabled defaultValue={review?.reviewDetails?.STAR} className="text-sm" />
                    <span className="text-sm text-gray-500">{formattedDate}</span>
                </div>
            </div>
            <div className="text-gray-800">Service used: {review?.reviewDetails.SERVICE_NAME}</div>
            <div className="text-gray-600">{review?.reviewDetails.CONTENT}</div>
            {review?.reviewDetails.ADDITIONAL_CONTENT && <div className="text-gray-500 text-sm">{review?.reviewDetails.ADDITIONAL_CONTENT}</div>}
        </motion.div>
        </>
    );
};

export default ReviewCard;