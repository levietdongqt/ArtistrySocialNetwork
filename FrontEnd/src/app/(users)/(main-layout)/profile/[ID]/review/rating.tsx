'use client';
import React, { useState } from 'react';
import { Rate, Button } from 'antd';
import { Review } from '@models/review';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import {AnimatePresence, motion} from "framer-motion";

export interface RatingProps {
    reviews: Review[];
}

const Rating: React.FC<RatingProps> = ({ reviews }) => {
    const [expanded, setExpanded] = useState(false);

    const overallRating = reviews.reduce((total, review) => total + review.reviewDetails.star, 0) / reviews.length;

    const serviceRatings = reviews.reduce((acc, review) => {
        const { serviceName, star } = review.reviewDetails;
        if (!acc[serviceName]) acc[serviceName] = { total: 0, count: 0 };
        acc[serviceName].total += star;
        acc[serviceName].count += 1;
        return acc;
    }, {} as { [serviceName: string]: { total: number; count: number } });

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };
    const containerVariants = {
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        collapsed: {
            opacity: 0,
            height: 0,
            transition: {
                when: "afterChildren",
            }
        },
    };

    const childVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.01, // thời gian hiển thị chũ
            },
        },
        collapsed: {
            opacity: 0,
            y: -20,
            transition: {
                delay: 0.02, // thời gian ẩn chữ
            }
        },
    };

    return (
        <motion.div  initial="hidden"
                     animate="visible"
                     variants={containerVariants}
        >
        <div className="w-full max-w-2xl p-4 shadow-lg rounded-lg bg-white flex flex-col items-center">
            <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4 w-full">
                <h3 className="text-xl font-bold text-gray-700">Overall Rating</h3>
                <Rate allowHalf disabled value={overallRating} />
            </div>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={containerVariants}
                        transition={{duration: 0.5}}
                        className="mt-5 w-full"
                    >
                        <motion.span
                            variants={childVariants}
                        >
                            <div className={`mt-5 w-full ${expanded ? 'block' : 'hidden'}`}>
                                <h4 className="font-semibold text-lg text-gray-800 mb-3">Service Ratings:</h4>
                                <ul className="space-y-2">
                                    {Object.keys(serviceRatings).map((serviceName) => (
                                        <li key={serviceName} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-medium">{serviceName}</span>
                                                <Rate
                                                    allowHalf
                                                    disabled
                                                    value={serviceRatings[serviceName].total / serviceRatings[serviceName].count}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.span>



                    </motion.div>
                )}
            </AnimatePresence>


            <Button className="mt-3" type="link" onClick={toggleExpanded}>
                {expanded ? (
                    <>
                    Show Less <UpOutlined/>
                    </>
                ) : (
                    <>
                        See More <DownOutlined/>
                    </>
                )}
            </Button>
        </div>
        </motion.div>
    );
};

export default Rating;