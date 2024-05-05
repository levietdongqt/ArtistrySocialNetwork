'use client'
import React, {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import {Promotion, PromotionType} from "@models/promotion";
import { useUser } from 'context/user-context';
import { User } from '@models/user';
import PromotionValidation from '@lib/validations/PromotionValidation';
import { createPromotion, getAllPromotions, updatePromotion } from 'services/main/clientRequest/promotion';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

interface CreatePromotionsFromParams  {
    data?: Promotion
}

const CreatePromotionsForm = ({data} : CreatePromotionsFromParams) => {
    const {currentUser} = useUser();
    const [promotion, setPromotion] = useState<Promotion>(data !== undefined ? data : {
        id: 0,
        name: "",
        discountPercent: 0,
        startDate: new Date(),
        endDate: new Date(),
        description: "",
        type: PromotionType.FOR_SERVICE,
        status: true,
        user : currentUser as User
    });


   
    const {values, touched, handleSubmit, handleChange, errors,setFieldValue } = useFormik({
        initialValues: promotion,
        validationSchema: PromotionValidation,
        onSubmit: async (values: Promotion, {setSubmitting, resetForm }) => {
            const newPromotion = {
                ...values,
            };
            try {
                if (data !== undefined){
                    await updatePromotion(currentUser?.id as string,newPromotion);
                }else{
                    await createPromotion(currentUser?.id as string,newPromotion);
                }

                toast.success(data !== undefined ? "Chỉnh sửa khuyến mãi thành công" :"Tạo khuyến mãi thành công")
                mutate(getAllPromotions);
                resetForm();
            } catch (error) {
                if (data !== undefined){
                console.error("Failed to update promotion", error);
                }else{
                console.error("Failed to create promotion", error);
                }
            }
        },
    });

   


    return (
        <form onSubmit={handleSubmit} className="w-full mx-auto p-6 bg-white rounded shadow mr-10">
            <div className="mb-4">
                <label htmlFor="promotionName" className="block text-gray-700 text-sm font-bold mb-2">
                    Tên Khuyến mãi
                </label>
                <input
                    type="text"
                    id="promotionName"
                    name="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                    value={values.name}
                />
                {errors.name && touched.name ? (
                    <div className="text-red-700 text-sm">{errors.name}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="discountPercent" className="block text-gray-700 text-sm font-bold mb-2">
                   Phần trăm giảm giá
                </label>
                <input
                    type="number"
                    id="discountPercent"
                    name="discountPercent"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                    value={values.discountPercent}
                />
                {errors.discountPercent && touched.discountPercent ? (
                    <div className="text-red-700 text-sm">{errors.discountPercent}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                    Loại Giảm giá
                </label>
                <select
                    id="type"
                    name="type"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleChange}
                    value={values.type}
                >

                    <option value={PromotionType.FOR_SERVICE}>Áp dụng cho Dịch vụ</option>
                    <option value={PromotionType.FOR_ORDER}>Áp dụng cho đơn hàng</option>
                </select>
                {errors.type && touched.type ? (
                    <div className="text-red-700 text-sm">{errors.type}</div>
                ) : null}
            </div>
            <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                Thời gian bắt đầu khuyến mãi
            </label>
            <DatePicker
                id="startDate"
                name="startDate"
                value={values.startDate ? dayjs(values.startDate) : null}
                onChange={(dateString) => setFieldValue('startDate', dateString)}
                format="DD/MM/YYYY"
            />
            {errors.startDate && touched.startDate && (
                <div className="text-red-700 text-sm">{errors.startDate as string}</div>
            )}
        </div>
        <div className="mb-4">
            <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                Thời gian bắt đầu khuyến mãi
            </label>
            <DatePicker
                id="endDate"
                name="endDate"
                value={values.endDate ? dayjs(values.endDate) : null}
                onChange={(dateString) => setFieldValue('endDate', dateString)}
                format="DD/MM/YYYY"
                className="ant-input"
      
            />
            {errors.endDate && touched.endDate && (
                <div className="text-red-700 text-sm">{errors.endDate as string}</div>
            )}
        </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Mô Tả
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={handleChange}
                        value={values.description}
                    />
                    {errors.description && touched.description ? (
                        <div className="text-red-700 text-sm">{errors.description}</div>
                    ) : null}
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {data !== undefined ? "Sửa khuyến mãi" : "Tạo Khuyến mãi"}
                    </button>
                </div>
        </form>
);
};

export default CreatePromotionsForm;