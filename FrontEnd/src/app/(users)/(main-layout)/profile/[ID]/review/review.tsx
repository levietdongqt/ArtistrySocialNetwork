import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from "./rating";
import {Review} from "@models/review";
import ReviewCard from "./reviewcard";


// ... (định nghĩa của các type JsonObject, Review và ReviewDetails từ dữ liệu của bạn)

const ReviewComponent: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/reviews');
                setReviews(response.data);
            } catch (error) {
                setError(error instanceof Error ? error.message : String(error));
            }
        };

        fetchReviews();
    }, []);

    // Tính toán overall rating

    return (
        <>
            <div className="review-component">
                {error && <p className="text-red-500">{error}</p>}
                {reviews.length > 0 ? (
                    <Rating reviews={reviews}/>
                ) : (
                    <p>No reviews to display</p>
                )}


            </div>
            <div className="container mx-auto p-4 space-y-4">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review}/>
                ))}
            </div>
        </>
    );
};

export default ReviewComponent;