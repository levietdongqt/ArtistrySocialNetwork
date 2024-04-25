'use client'
import React, {useEffect, useState} from 'react';
import { MainService } from "@models/main-service";
import { useUser } from "../../../../../context/user-context";
import { createMainService } from "../../../../../services/main/clientRequest/service";
import ImageService , { ImageItem } from "./image-service";
import { useFormik } from 'formik';
import ServiceValidation from "@lib/validations/ServiceValidation";
import {Promotion} from "@models/promotion";


const CreateMainServiceForm = () => {
    const {currentUser} = useUser();
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/promotions')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((data) => {
                setPromotions(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    const [mService, setMService] = useState<MainService>({
        id: null, // Làm cho giá trị này undefined cho đối tượng mới tạo
        provider: currentUser, // Sử dụng currentUser từ hook useUser
        name: '',
        price: 0,
        priceType: '',
        duration: 0,
        restTime: 0,
        imageUrl: [],
        description: '',
        createDate: new Date(),
        updateDate: new Date(),
        promotionId: 0,
        status: true,
    });

    const [promotionId, setPromotionId] = useState<number | null>(null);
    const handlePromotionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // Chuyển giá trị nhận được từ event.target.value sang kiểu number trước khi gán giá trị
        const value = event.target.value === 'null' ? null : Number(event.target.value);

        // Cập nhật giá trị trong state
        setPromotionId(value);
    };
    const {values, touched, handleSubmit, handleChange, errors } = useFormik({
        initialValues: mService,
        validationSchema: ServiceValidation,
        onSubmit: async (values: MainService, {setSubmitting, resetForm }) => {
            const newService = {

                ...values,
                imageUrl: mService.imageUrl,
                promotion: promotionId

            };
            console.log('newservice:',newService);

            try {
                const response = await createMainService(newService);

                console.log("Service created successfully", response);


                resetForm();
            } catch (error) {

                console.error("Failed to create service", error);
            }
        },
    });
    const handleImageListChange = (newImageList: ImageItem[]) => {
        // Chỉ cần cập nhật mService imageUrl thay vì gọi setFieldValue tại đây.
        setMService({
            ...mService,
            imageUrl: newImageList.map((imageItem) => imageItem.src),
        });
    };


    return (
        <form onSubmit={handleSubmit} className="w-full mx-auto p-6 bg-white rounded shadow mr-10">
            <ImageService onImageListChange={handleImageListChange}/>
            <div className="mb-4">
                <label htmlFor="serviceName" className="block text-gray-700 text-sm font-bold mb-2">
                    Tên Dịch Vụ
                </label>
                <input
                    type="text"
                    id="serviceName"
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
                <label htmlFor="servicePrice" className="block text-gray-700 text-sm font-bold mb-2">
                    Giá Dịch Vụ
                </label>
                <input
                    type="number"
                    id="servicePrice"
                    name="price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                    value={values.price}
                />
                {errors.price && touched.price ? (
                    <div className="text-red-700 text-sm">{errors.price}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="priceType" className="block text-gray-700 text-sm font-bold mb-2">
                    Loại Giá
                </label>
                <select
                    id="priceType"
                    name="priceType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleChange}
                    value={values.priceType}
                >
                    <option value='null'>Chọn loại giá</option>
                    <option value="Giờ">Giờ</option>
                    <option value="Concept">Concept</option>
                    <option value="Ngày">Ngày</option>
                    <option value="Khác">Khác...</option>
                </select>
                {errors.priceType && touched.priceType ? (
                    <div className="text-red-700 text-sm">{errors.priceType}</div>
                ) : null}
            </div>
            <div className="mb-4">
                <label htmlFor="servicePrice" className="block text-gray-700 text-sm font-bold mb-2">
                    Khoảng thời gian
                </label>
                <input
                    type="number"
                    id="duration"
                    name="duration"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                    value={values.duration}
                />
                {errors.duration && touched.duration ? (
                    <div className="text-red-700 text-sm">{errors.duration}</div>
                ) : null}
            </div>

            <div className="mb-4">
                <label htmlFor="servicePrice" className="block text-gray-700 text-sm font-bold mb-2">
                    Thời gian nghỉ
                </label>
                <input
                    type="number"
                    id="restTime"
                    name="restTime"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                    value={values.restTime}
                />
                {errors.restTime && touched.restTime ? (
                    <div className="text-red-700 text-sm">{errors.restTime}</div>
                ) : null}
            </div>
            <div className="mb-4">
                <select
                    id="promotionId"
                    name="promotionId"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handlePromotionChange}
                    value={promotionId === null ? 'null' : promotionId.toString()} // Đảm bảo giá trị hiện hành đúng với state
                >
                    <option value='null'>Chọn khuyến mãi</option>
                    {promotions.map((promotion) => (
                        <option key={promotion.id} value={promotion.id}>
                            {promotion.name}
                        </option>
                    ))}
                </select>
            </div>
                <div className="mb-4">
                    <label htmlFor="serviceDescription" className="block text-gray-700 text-sm font-bold mb-2">
                        Mô Tả Dịch Vụ
                    </label>
                    <textarea
                        id="serviceDescription"
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
                        Tạo Dịch Vụ
                    </button>
                </div>
        </form>
);
};

export default CreateMainServiceForm;