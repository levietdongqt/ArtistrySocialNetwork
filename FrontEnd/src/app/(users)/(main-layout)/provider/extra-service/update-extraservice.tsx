"use client";
import React, { useEffect, useState } from "react";
import { EditableMainServiceData, MainService } from "@models/main-service";
import { useUser } from "../../../../../context/user-context";
import {
  createMainService,
  GetMainServiceById, updateExtraService,
  updateMainService,
} from "../../../../../services/main/clientRequest/service";
import ImageService, { ImageItem } from "./image-service";
import { useFormik } from "formik";
import  {ExtraServiceValidation} from "@lib/validations/ServiceValidation";
import { Promotion } from "@models/promotion";
import useSWR from "swr";
import { getPromotions } from "services/main/clientRequest/promotion";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import UploadFile from "app/(users)/_components/main-service/upload-file";
import { useUpload } from "context/uploadfile-context";
import { FilesWithId } from "@models/file";
import { transformToFilesWithId } from "@lib/utils";
import { uploadImages } from "../../../../../firebase/utils";
import DescriptionInput from "../../../_components/input/input-description";
import {toast} from "react-toastify";
import {ExtraService} from "@models/extra-service";
type PropUpdateMainService = {
  data: MainService;
  closeModal: () => void;
};


const UpdateExtraService = ({ data,closeModal }: PropUpdateMainService) => {
  console.log("UpdateMainService", data);
  const { currentUser } = useUser();
  const [updateService1, setUpdateService1] = useState<MainService>();
  const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const { files, urlUpload,setFiles} = useUpload();
  const [newdescription, setNewDescription] = useState<string>(data?.description);
  //const [updateService, setUpdateService] = useState<MainService>(data);

  const handleDescriptionChange = (content: string) => {
    setNewDescription(content);
    console.log('conten',newdescription)
  };
  const {
    data: dataPromotion,
    isLoading: isLoading2,
    error: error2,
  } = useSWR(
    getPromotions(currentUser?.id as string, true, false),
    fetcherWithToken
  );
  useEffect(() => {
    if (dataPromotion) {
      setPromotions(dataPromotion.data);
    }
  }, [dataPromotion]);

  // console.log('updatedata',updateService.name)

  const [promotionId, setPromotionId] = useState<any | null>(null);
  const [applyPromotion, setApplyPromotion] = useState<any | null>(null);
  const handlePromotionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Chuyển giá trị nhận được từ event.target.value sang kiểu number trước khi gán giá trị
    const value =
      event.target.value === "null" ? null : Number(event.target.value);
    console.log("promotionid", value);
    var result = promotions.find((promotion) => promotion.id === value);
    // Cập nhật giá trị trong state
    setPromotionId(value);
    setApplyPromotion(result);
  };
  useEffect(() => {
    // Đảm bảo rằng promotionDTO của service có giá trị và có id
    if (data && data.promotionDTO && data.promotionDTO.id) {
      setPromotionId(data.promotionDTO.id); // Set giá trị cũ của khuyến mãi vào state
      setApplyPromotion(data.promotionDTO); // Bạn cũng có thể muốn lưu cả đối tượng promotionDTO nếu cần
    }
  }, [data]);


  const { values, touched, handleSubmit, handleChange, errors, setFieldValue } =
    useFormik({
      initialValues: {
        id: data.id,
        name: data.name,
        price: data.price,
        priceType: data.priceType,
        duration: data.duration,
        restTime: data.restTime,
        imageUrls: data.imageUrls,
        description: data.description,
        updateDate: new Date(),
        promotionDTO: data.promotionDTO,
        provider: data.provider,
        status: data.status,
        createDate: data.createDate,
      },
      validationSchema: ExtraServiceValidation,
      onSubmit: async (values: ExtraService, { setSubmitting, resetForm }) => {
        const newService = {
            ...values,
            promotionDTO: applyPromotion,
            description : newdescription
        };
        try {
          toast.promise(
              updateExtraService(newService), // Hàm async để thực thi
              {
                pending: 'Đang cập nhật thông tin...', // Thông báo khi đang xử lý
                success: 'Cập nhật thông tin thành công', // Thông báo khi thành công
                error: 'Cập nhật thông tin thất bại!' // Thông báo khi có lỗi
              }
          ).then(() => {
            closeModal(); // Gọi hàm đóng Modal
          }).catch(error => {

            console.error("Failed to update service", error);
          });
        } catch (error) {
          console.error("Failed to create service", error);
        }
      },
    });

  return (
      <form
          onSubmit={handleSubmit}
          className="w-full mx-auto p-6 bg-white rounded shadow mr-10"
      >
        {/*<UploadFile urlMedia={values.imageUrls}/>*/}

        {/* <ImageService onImageListChange={handleImageListChange}/> */}
        <div className="mb-4">
          <label
              htmlFor="serviceName"
              className="block text-gray-700 text-sm font-bold mb-2"
          >
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
          <label
              htmlFor="priceType"
              className="block text-gray-700 text-sm font-bold mb-2"
          >
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
        {/*  <label*/}
        {/*      htmlFor="servicePrice"*/}
        {/*      className="block text-gray-700 text-sm font-bold mb-2"*/}
        {/*  >*/}
        {/*    Khoảng thời gian (Giờ)*/}
        {/*  </label>*/}
        {/*  <input*/}
        {/*      type="number"*/}
        {/*      id="duration"*/}
        {/*      name="duration"*/}
        {/*      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/}
        {/*      required*/}
        {/*      onChange={handleChange}*/}
        {/*      value={values.duration}*/}
        {/*  />*/}
        {/*  {errors.duration && touched.duration ? (*/}
        {/*      <div className="text-red-700 text-sm">{errors.duration}</div>*/}
        {/*  ) : null}*/}
        {/*</div>*/}

        {/*<div className="mb-4">*/}
        {/*  <label*/}
        {/*      htmlFor="servicePrice"*/}
        {/*      className="block text-gray-700 text-sm font-bold mb-2"*/}
        {/*  >*/}
        {/*    Thời gian nghỉ (Phút)*/}
        {/*  </label>*/}
        {/*  <input*/}
        {/*      type="number"*/}
        {/*      id="restTime"*/}
        {/*      name="restTime"*/}
        {/*      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/}
        {/*      required*/}
        {/*      onChange={handleChange}*/}
        {/*      value={values.restTime}*/}
        {/*  />*/}
        {/*  {errors.restTime && touched.restTime ? (*/}
        {/*      <div className="text-red-700 text-sm">{errors.restTime}</div>*/}
        {/*  ) : null}*/}
        {/*</div>*/}
        <div className="mb-4">
          <select
              id="promotionId"
              name="promotionId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handlePromotionChange}
              value={promotionId === null ? "null" : promotionId.toString()} // Sử dụng giá trị từ state
          >
            <option value="null">Chọn khuyến mãi</option>
            {promotions.map((promotion) => (
                <option key={promotion.id} value={promotion.id}>
                  {promotion.name}
                </option>
            ))}
          </select>
        </div>
        <div className="mb-4 ">
          <label
              htmlFor="serviceDescription"
              className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mô tả dịch vụ
          </label>
          <DescriptionInput
              value={newdescription || ""}
              onChange={handleDescriptionChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sửa thông tin dịch vụ
          </button>
        </div>
      </form>
  );
};

export default UpdateExtraService;
