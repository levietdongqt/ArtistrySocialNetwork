import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import Rating from "./rating";
import ReviewCard from "./reviewcard";
import {useUser} from "../../../../../../context/user-context";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";

interface ReviewComponentProps {
    id: string;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ id }) => {
    const { data: reviews, error } = useSWR(`/api/reviews?id=${id}`, fetcherWithToken)
    console.log('Review',reviews?.data)

    return (
        <>
            <div className="review-component">
                {reviews?.data.length > 0 ? (
                    <Rating reviews={reviews}/>
                ) : (
                    <p>No reviews to display</p>
                )}
            </div>
            <div className="container mx-auto p-4 space-y-4">
                {reviews?.data.map((review: any) => (
                    <ReviewCard key={review.id} review={review}/>
                ))}
            </div>
        </>
    );
};

export default ReviewComponent;