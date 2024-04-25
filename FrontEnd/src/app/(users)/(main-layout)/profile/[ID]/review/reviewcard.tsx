'use client'
import React from 'react';
import { Rate } from 'antd';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Review } from '@models/review';
import {UserAvatar} from "../../../../_components/user/user-avatar";



interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const {
        reviewDetails: { star, content, additionalContent, createdDate, serviceName },
    } = review;

    const username = "John Doe"; // Thay đổi thành username từ dữ liệu sau này.

    const dateObject = new Date(createdDate);
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
        <motion.div
            whileHover="hover"
            variants={variants}
            transition={{ duration: 0.25 }}
            className="bg-white p-4 rounded-lg shadow-xl space-y-4"
            style={{ perspective: 1000 }} // Apply perspective to get a more pronounced 3D effect
        >
            <div className="flex items-center space-x-4">
                <UserAvatar src={"https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"} alt={username} username={username} />
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{username}</span>
                    <Rate disabled defaultValue={star} className="text-sm" />
                    <span className="text-sm text-gray-500">{formattedDate}</span>
                </div>
            </div>
            <div className="text-gray-800">Service used: {serviceName}</div>
            <div className="text-gray-600">{content}</div>
            {additionalContent && <div className="text-gray-500 text-sm">{additionalContent}</div>}
        </motion.div>
    );
};

export default ReviewCard;