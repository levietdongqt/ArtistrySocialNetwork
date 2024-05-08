'use client'
import React, {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import ServiceValidation from "@lib/validations/ServiceValidation";
import useSWR from 'swr';
import { fetcherWithToken } from '@lib/config/SwrFetcherConfig';
import {useUser} from "../../../../../../context/user-context";
import {useParams} from "next/navigation";
import {createReview, getUserById} from "../../../../../../services/main/clientRequest/userClient";
import {MainService} from "@models/main-service";
import {Review} from "@models/review";
import {toast} from "react-toastify";
import {Rate} from "antd";
import ReviewValidation from "@lib/validations/ReviewValidation";


interface PropReview{
    service: MainService
    closeModal: () => void;
}

const CreateReview = ({service,closeModal}:PropReview) => {
    const {currentUser} = useUser();
    const { ID } = useParams()
    const {data:providerUser,isLoading:loading} = useSWR(getUserById(ID as string), fetcherWithToken);
    const [content, setContent] = useState('');
    const [addContent, setAddContent] = useState('');
    const [star, setStar] = useState(0);

    const [review] = useState<Review>({
        id: null,
        providerUser:service.provider!,
        customerUser:currentUser!,
        reviewDetails: { CREATE_DATE : Date.now().toString()
            ,CONTENT : ''
            ,ADDITIONAL_CONTENT: ''
            ,MAIN_SERVICE_ID:service?.id
            ,STAR:0
            ,SERVICE_NAME :service?.name,
            IS_HAVE_ORDER: true,
            LIKE_NUMBER:0
        }

    });


    const {values, touched, handleSubmit, handleChange, errors } = useFormik({
        initialValues: review,
        validationSchema: ReviewValidation,
        onSubmit: async (values: Review, {setSubmitting, resetForm }) => {

            const newReview = {
                ...values,
                reviewDetails: { CREATE_DATE : Date.now().toString()
                    ,CONTENT : content
                    ,ADDITIONAL_CONTENT:addContent
                    ,MAIN_SERVICE_ID:service?.id
                    ,STAR:star
                    ,SERVICE_NAME :service?.name,
                    IS_HAVE_ORDER: true,
                    LIKE_NUMBER:0
                }


            };
                console.log('newReview',newReview);
            try {
                const response = await createReview(newReview);
                toast.success('Review thành công');
                resetForm();
            } catch (error) {

                console.error("Failed to create service", error);
            }
        },
    });


    return (
        <form onSubmit={handleSubmit} className="w-full h-full mx-auto p-6 bg-white rounded shadow">
            <div className="mb-4">
                <label htmlFor="SERVICE_NAME" className="block text-gray-700 text-sm font-bold mb-2">Đánh giá dịch vụ : {review.reviewDetails.SERVICE_NAME}</label>
            </div>
            <div className="mb-4">
                <label htmlFor="CONTENT" className="block text-gray-700 text-sm font-bold mb-2">Tiêu đề đánh
                    giá</label>
                <textarea
                    id="CONTENT"
                    name="CONTENT"
                    onChange={(event) => setContent(event.target.value)}
                    value={content}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="CONTENT" className="block text-gray-700 text-sm font-bold mb-2">Nội dung đánh
                    giá</label>
                <textarea
                    id="CONTENT"
                    name="CONTENT"
                    onChange={(event) => setAddContent(event.target.value)}
                    value={addContent}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="STAR" className="block text-gray-700 text-sm font-bold mb-2">Đánh giá bằng sao</label>
                <Rate
                    onChange={setStar}
                    value={star}
                    className="text-xl" // Bạn có thể điều chỉnh kích thước sao thông qua class
                />
            </div>

            <div className="flex items-center justify-between">
                <button type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Gửi đánh giá
                </button>
            </div>
        </form>

    );
};

export default CreateReview;