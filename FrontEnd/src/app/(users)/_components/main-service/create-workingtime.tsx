'use client'
import React, {useEffect, useState} from 'react';
import { MainService } from "@models/main-service";
import { useFormik } from 'formik';
import ServiceValidation from "@lib/validations/ServiceValidation";
import {Promotion, PromotionType} from "@models/promotion";
import { useUser } from 'context/user-context';
import { User } from '@models/user';
import PromotionValidation from '@lib/validations/PromotionValidation';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import UploadFile from './upload-file';
import { WorkingTime } from '@models/workingTime';
import WorkingTimeValidation from '@lib/validations/WorkingTimeValidation';
import { createWorkingTime, getAllWorkingTimes, updateWorkingTime } from 'services/main/clientRequest/working-time';
import { DayOfWeek } from '@lib/enum/WorkingDay';
import { mutate } from 'swr';

interface CreateWorkingTimesParams  {
    data?: WorkingTime
}

const CreateWorkingTimesForm = ({data} : CreateWorkingTimesParams) => {
    const {currentUser} = useUser();
    const [workingTime, setWorkingTime] = useState<WorkingTime>(data !== undefined ? data : {
        id: 0,
        startDate: new Date(),
        endDate: new Date(),
        workingDays: [],
        status: true,
        provider : currentUser as User
    });


   
    const {values, touched, handleSubmit, handleChange, errors,setFieldValue } = useFormik({
        initialValues: workingTime,
        validationSchema: WorkingTimeValidation,
        onSubmit: async (values: WorkingTime, {setSubmitting, resetForm }) => {
            const newWorkingTime = {
                ...values,
            };
            try {
                if (data !== undefined){
                    await updateWorkingTime(currentUser?.id as string,newWorkingTime);
                }else{
                    await createWorkingTime(currentUser?.id as string,newWorkingTime);
                }

                toast.success(data !== undefined ? "Chỉnh sửa lịch thành công" :"Tạo lịch thành công")
                mutate(getAllWorkingTimes);
                resetForm();
            } catch (error) {
                if (data !== undefined){
                console.error("Failed to update working time", error);
                }else{
                console.error("Failed to create working time", error);
                }
            }
        },
    });

   


    return (
        <>
        <form onSubmit={handleSubmit} className="w-full mx-auto p-6 bg-white rounded shadow mr-10">
        <h1>Tạo lịch</h1>
            <div className="mb-4">
              
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                Thời gian bắt đầu khuyến mãi
            </label>
            <DatePicker
                id="startDate"
                name="startDate"
                value={values.startDate ? dayjs(values.startDate) : null}
                onChange={(dateString) => setFieldValue('startDate', dateString)}
                format="DD/MM/YYYY HH:mm:ss"
                showTime
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
                format="DD/MM/YYYY HH:mm:ss"
                className="ant-input"
                showTime
      
            />
            {errors.endDate && touched.endDate && (
                <div className="text-red-700 text-sm">{errors.endDate as string}</div>
            )}
        </div>
        <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                    Loại Giảm giá
                </label>
                <select
                    id="workingDays"
                    name="workingDays"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleChange}
                    value={values.workingDays}
                    multiple
                >
                    <option value={DayOfWeek.MONDAY}>Thứ hai</option>
                    <option value={DayOfWeek.TUESDAY}>Thứ ba</option>
                    <option value={DayOfWeek.WEDNESDAY}>Thứ tư</option>
                    <option value={DayOfWeek.THURSDAY}>Thứ năm</option>
                    <option value={DayOfWeek.FRIDAY}>Thứ sáu</option>
                    <option value={DayOfWeek.SATURDAY}>Thứ bảy</option>
                    <option value={DayOfWeek.SUNDAY}>Chủ nhật</option>
                </select>
                {errors.workingDays && touched.workingDays ? (
                    <div className="text-red-700 text-sm">{errors.workingDays}</div>
                ) : null}
            </div>
            <div className="flex items-center justify-between">
                    <button type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {data !== undefined ? "Sửa Lịch" : "Tạo Lịch"}
                    </button>
                </div>
                
        </form>
        </>
);
};

export default CreateWorkingTimesForm;