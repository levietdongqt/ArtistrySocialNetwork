'use client'
import React, {useEffect, useState} from 'react';
import { MainService } from "@models/main-service";
import { useUser } from "../../../../../context/user-context";
import {createExtraService, createMainService} from "../../../../../services/main/clientRequest/service";
import ImageService , { ImageItem } from "./image-service";
import { useFormik } from 'formik';

import {Promotion} from "@models/promotion";
import useSWR from 'swr';
import { getPromotions } from 'services/main/clientRequest/promotion';
import { fetcherWithToken } from '@lib/config/SwrFetcherConfig';
import UploadFile from 'app/(users)/_components/main-service/upload-file';
import { useUpload } from 'context/uploadfile-context';
import { FilesWithId } from '@models/file';
import { transformToFilesWithId } from '@lib/utils';
import {uploadImages} from "../../../../../firebase/utils";
import {ExtraService} from "@models/extra-service";
import DescriptionInput from "../../../_components/input/input-description";
import {toast} from "react-toastify";
import {ExtraServiceValidation} from "@lib/validations/ServiceValidation";

interface CreateExtraServiceFormProps {
    closeModal: () => void;
};

const CreateExtraServiceForm:React.FC<CreateExtraServiceFormProps> = ({ closeModal }) => {
    const {currentUser} = useUser();
    const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const {files} = useUpload();
    const [newdescription, setNewDescription] = useState('')

    const {
        data: dataPromotion,
        isLoading: isLoading2,
        error: error2,
    } = useSWR(
        getPromotions(currentUser?.id as string,true,false),
        fetcherWithToken
    );
    useEffect(()=>{
        if(dataPromotion){
            setPromotions(dataPromotion.data);
        }
    },[dataPromotion])
    const [eService, setMService] = useState<ExtraService>({
        id: null, // Làm cho giá trị này undefined cho đối tượng mới tạo
        provider: currentUser, // Sử dụng currentUser từ hook useUser
        name: '',
        price: 0,
        priceType: '',
        duration: 0,
        restTime: 0,
        imageUrls: [],
        description: '',
        createDate: new Date(),
        updateDate: new Date(),
        promotionDTO: null,
        status: true,
    });

    const [promotionId, setPromotionId] = useState<number | null>(null);
    const [applyPromotion,setApplyPromotion] = useState<any | null>(null);
    const handlePromotionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // Chuyển giá trị nhận được từ event.target.value sang kiểu number trước khi gán giá trị
        const value = event.target.value === 'null' ? null : Number(event.target.value);
        console.log("promotionid",value);
        var result = promotions.find((promotion)=> promotion.id === value);
        // Cập nhật giá trị trong state
        setPromotionId(value);
        setApplyPromotion(result);

    };
    const handleDescriptionChange = (content: string) => {
        setNewDescription(content);
    };
    const {values, touched, handleSubmit, handleChange, errors } = useFormik({
        initialValues: eService,
        validationSchema: ExtraServiceValidation,
        onSubmit: async (values: ExtraService, {setSubmitting, resetForm }) => {
            const uploadedImagesData = await uploadImages(currentUser?.id as string,files as FilesWithId);
            const imageUrls = uploadedImagesData?.map((upload: any,index: any)=> upload.src);

            const newService = {

                ...values,
                destination:newdescription,
                imageUrls: imageUrls as string[],
                promotionDTO: applyPromotion
            };

            try {

                toast.promise(
                    createExtraService(newService), // Hàm async để thực thi
                    {
                        pending: 'Đang tạo dịch vụ ...', // Thông báo khi đang xử lý
                        success: 'Tạo dịch vụ thành công', // Thông báo khi thành công
                        error: 'Tạo dịch vụ thất bại!' // Thông báo khi có lỗi
                    }
                ).then(() => {
                    // Nếu Promise được resolve, tức là "Tạo dịch vụ thành công"
                    closeModal(); // Gọi hàm đóng Modal
                }).catch(error => {
                    // Nếu có lỗi xảy ra, Promise được reject
                    console.error("Failed to create service", error);
                });
            } catch (error) {

                console.error("Failed to create services", error);
            }
        },
    });


    return (
        <form onSubmit={handleSubmit} className="w-full mx-auto p-6 bg-white rounded shadow mr-10">

            {/*<UploadFile/>*/}

            {/* <ImageService onImageListChange={handleImageListChange}/> */}
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
                {values.price > 0 && (
                    <div className="text-green-600 text-sm mt-1">
                        Giá tương ứng: {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(values.price)}
                    </div>
                )}
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
                    <option value="Ngày">Ngày</option>
                    <option value="Album ảnh">Album ảnh</option>
                    <option value="Phiên trang điểm">Phiên trang điểm</option>
                    <option value="Khác">Khác...</option>
                </select>
                {errors.priceType && touched.priceType ? (
                    <div className="text-red-700 text-sm">{errors.priceType}</div>
                ) : null}
            </div>
            {/*<div className="mb-4">*/}
            {/*    <label htmlFor="servicePrice" className="block text-gray-700 text-sm font-bold mb-2">*/}
            {/*        Khoảng thời gian (Giờ)*/}
            {/*    </label>*/}
            {/*    <input*/}
            {/*        type="number"*/}
            {/*        id="duration"*/}
            {/*        name="duration"*/}
            {/*        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/}
            {/*        required*/}
            {/*        onChange={handleChange}*/}
            {/*        value={values.duration}*/}
            {/*    />*/}
            {/*    {errors.duration && touched.duration ? (*/}
            {/*        <div className="text-red-700 text-sm">{errors.duration}</div>*/}
            {/*    ) : null}*/}
            {/*</div>*/}

            {/*<div className="mb-4">*/}
            {/*    <label htmlFor="servicePrice" className="block text-gray-700 text-sm font-bold mb-2">*/}
            {/*        Thời gian nghỉ (Phút)*/}
            {/*    </label>*/}
            {/*    <input*/}
            {/*        type="number"*/}
            {/*        id="restTime"*/}
            {/*        name="restTime"*/}
            {/*        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/}
            {/*        required*/}
            {/*        onChange={handleChange}*/}
            {/*        value={values.restTime}*/}
            {/*    />*/}
            {/*    {errors.restTime && touched.restTime ? (*/}
            {/*        <div className="text-red-700 text-sm">{errors.restTime}</div>*/}
            {/*    ) : null}*/}
            {/*</div>*/}

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
            <div className="mb-4 ">
                <label htmlFor="serviceDescription" className="block text-gray-700 text-sm font-bold mb-2">
                    Mô tả dịch vụ
                </label>
                <DescriptionInput
                    value={newdescription || ''}
                    onChange={handleDescriptionChange}
                />

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

export default CreateExtraServiceForm;