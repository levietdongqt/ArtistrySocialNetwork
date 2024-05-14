"use client";
import React, { useEffect, useState } from "react";
import { MainService } from "@models/main-service";
import { useFormik } from "formik";
import ServiceValidation from "@lib/validations/ServiceValidation";
import { Promotion, PromotionType } from "@models/promotion";
import { useUser } from "context/user-context";
import { User } from "@models/user";
import PromotionValidation from "@lib/validations/PromotionValidation";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import UploadFile from "./upload-file";
import { WorkingTime } from "@models/workingTime";
import WorkingTimeValidation from "@lib/validations/WorkingTimeValidation";
import {
  createWorkingTime,
  getAllWorkingTimes,
  updateWorkingTime,
} from "services/main/clientRequest/working-time";
import { DayOfWeek } from "@lib/enum/WorkingDay";
import { mutate } from "swr";
import {
  convertToISODate,
  formatDate,
  getDatesBetween,
  getVietnameseDayFromDay,
  setTimeForDates,
} from "@lib/helper/convertTime";
import UpdateWorkingTimeValidation from "@lib/validations/UpdateWorkingTimeValidation";
import { customSortDayOfWeek } from "@lib/helper/customSortHelper";

interface CreateWorkingTimesParams {
  data?: WorkingTime;
  array?: WorkingTime[];
}

const CreateWorkingTimesForm = ({ data, array }: CreateWorkingTimesParams) => {
  const { currentUser } = useUser();
  const [startDateCheck, setStartDateCheck] = useState(false);
  const [startDateCheckValue, setStartDateCheckValue] = useState<any>(null);
  const [endDateCheckValue, setEndDateCheckValue] = useState<any>(null);
  const [workingDaysValue, setWorkingDaysValue] = useState<Set<DayOfWeek>>();
  const [endDateCheck, setEndDateCheck] = useState(false);
  const [workingTime, setWorkingTime] = useState<any>({
    id: data?.id ?? 0,
    startDate: data?.startDate ?? new Date(),
    startTime: data?.startDate ?? new Date(),
    endDate: data?.endDate ?? new Date(),
    endTime: data?.endDate ?? new Date(),
    workingDays: data?.workingDays ?? [],
    status: data?.status ?? true,
    provider: data?.provider ?? (currentUser as User),
  });
  useEffect(() => {
    if (data != undefined) {
      setStartDateCheckValue(dayjs(data.startDate));
      setEndDateCheckValue(dayjs(data.endDate));
      setWorkingDaysValue(
        getDatesBetween(dayjs(data.startDate) as any,dayjs(data.endDate) as any)
      );
      setStartDateCheck(true);
      setEndDateCheck(true);
    }
  }, [JSON.stringify(data)]);

  useEffect(() => {
    if (startDateCheckValue !== null || endDateCheckValue !== null) {
      setWorkingDaysValue(    
        getDatesBetween(startDateCheckValue, endDateCheckValue)
      );
    }
  }, [startDateCheckValue,endDateCheckValue]);

  const { values, touched, handleSubmit, handleChange, errors, setFieldValue } =
    useFormik({
      initialValues: workingTime,
      validationSchema:
        data === undefined
          ? WorkingTimeValidation
          : UpdateWorkingTimeValidation,
      onSubmit: async (values: any, { setSubmitting, resetForm }) => {
        var existedStartDates: number | undefined = -1
        var existedEndDates: number | undefined = -1
        var existedEndStartDates: number | undefined = -1
        if (values.id === 0) {
          existedStartDates = array?.findIndex(
            (date) =>
              new Date(values.startDate) >=
                formatDate(new Date(date.startDate)) &&
              new Date(values.startDate) <= formatDate(new Date(date.endDate))
          );
          existedEndDates = array?.findIndex(
            (date) =>
              new Date(values.endDate) >=
                formatDate(new Date(date.startDate)) &&
              new Date(values.endDate) <= formatDate(new Date(date.endDate)))
          existedEndStartDates = array?.findIndex(
            (date) => new Date(values.startDate)<= formatDate(new Date(date.startDate)) && new Date(values.endDate) >= formatDate(new Date(date.endDate))
          )
        }else{
          existedStartDates = array?.findIndex(
            (date) =>
              (new Date(values.startDate) >=
                formatDate(new Date(date.startDate)) &&
              new Date(values.startDate) <= formatDate(new Date(date.endDate))) && (
                date.id!== values.id
              )
          );
          existedEndDates = array?.findIndex(
            (date) =>
              (new Date(values.endDate) >=
                formatDate(new Date(date.startDate)) &&
              new Date(values.endDate) <= formatDate(new Date(date.endDate))) && (
                date.id!== values.id
              ))
          existedEndStartDates = array?.findIndex(
                (date) => (new Date(values.startDate)<= formatDate(new Date(date.startDate)) && new Date(values.endDate) >= formatDate(new Date(date.endDate))) && (date.id!== values.id)
              )
        }
        if (existedStartDates !== -1) {
          toast.error("Lịch đã tồn tại hoặc nằm trong khoảng thời gian đã có");
          return;
        }
        if (existedEndDates !== -1) {
          toast.error("Lịch đã tồn tại hoặc nằm trong khoảng thời gian đã có");
          return;
        }
        if (existedEndStartDates !== -1){
          toast.error("Lịch đã tồn tại hoặc nằm trong khoảng thời gian đã có");
          return;
        }
        const startDay = setTimeForDates(values.startDate, values.startTime);
        const endDay = setTimeForDates(values.endDate, values.endTime);
        const newWorkingTime: any = {
          id: data != undefined ? data.id : 0,
          startDate: convertToISODate(startDay),
          endDate: convertToISODate(endDay),
          workingDays: values.workingDays,
          status: values.status,
          provider: values.provider,
        };
        try {
          if (data !== undefined) {
            await updateWorkingTime(currentUser?.id as string, newWorkingTime);
          } else {
            await createWorkingTime(currentUser?.id as string, newWorkingTime);
          }

          toast.success(
            data !== undefined
              ? "Chỉnh sửa lịch thành công"
              : "Tạo lịch thành công"
          );
          mutate(getAllWorkingTimes);
          resetForm();
        } catch (error) {
          if (data !== undefined) {
            console.error("Failed to update working time", error);
          } else {
            console.error("Failed to create working time", error);
          }
        }
      },
    });

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-6 bg-white rounded shadow mr-10"
      >
        <h1>{
          data === undefined ? "Tạo lịch" : "Sửa lịch"
        }</h1>
        <div className="flex flex-row">
          <div className="mb-4 w-1/2">
            <label
              htmlFor="startDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Ngày bắt đầu
            </label>
            <DatePicker
              id="startDate"
              name="startDate"
              value={values.startDate ? dayjs(values.startDate) : null}
              onChange={(dateString) => {
                setFieldValue("startDate", dateString);
                setStartDateCheck(true);
                setStartDateCheckValue(dateString);
              }}
              format="DD/MM/YYYY"
            />
            {errors.startDate && touched.startDate && (
              <div className="text-red-700 text-sm">
                {errors.startDate as string}
              </div>
            )}
          </div>

          <div className="mb-5 w-1/2">
            <label
              htmlFor="endDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Ngày kết thúc
            </label>
            <DatePicker
              id="endDate"
              name="endDate"
              value={values.endDate ? dayjs(values.endDate) : null}
              onChange={(dateString) => {
                setFieldValue("endDate", dateString);
                setEndDateCheck(true);
                setEndDateCheckValue(dateString);
              }}
              format="DD/MM/YYYY"
              className="ant-input"
            />
            {errors.endDate && touched.endDate && (
              <div className="text-red-700 text-sm">
                {errors.endDate as string}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="mb-4 w-1/2">
            <label
              htmlFor="endTime"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Thời gian bắt đầu
            </label>
            <TimePicker
              id="startTime"
              name="startTime"
              value={values.startTime ? dayjs(values.startTime) : null}
              onChange={(timeString) => setFieldValue("startTime", timeString)}
              format="HH:mm"
              className="ant-input"
            />
            {errors.startTime && touched.startTime && (
              <div className="text-red-700 text-sm">
                {errors.startTime as string}
              </div>
            )}
          </div>
          <div className="mb-4 w-1/2">
            <label
              htmlFor="endTime"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Thời gian kết thúc
            </label>
            <TimePicker
              id="endTime"
              name="endTime"
              value={values.endTime ? dayjs(values.endTime) : null}
              onChange={(timeString) => setFieldValue("endTime", timeString)}
              format="HH:mm"
              className="ant-input"
            />
            {errors.endTime && touched.endTime && (
              <div className="text-red-700 text-sm">
                {errors.endTime as string}
              </div>
            )}
          </div>
        </div>
        {startDateCheck && endDateCheck && (
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Ngày làm việc
            </label>
            <select
              id="workingDays"
              name="workingDays"
              className="shadow appearance-none border rounded w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleChange}
              value={values.workingDays}
              multiple
            >
              {Array.from(workingDaysValue!)
                .sort(customSortDayOfWeek)
                .map((day: DayOfWeek, index: number) => (
                  <option key={index} value={day}>
                    {getVietnameseDayFromDay(day)}
                  </option>
                ))}
              {Array.from(workingDaysValue!).length === 0 && (
                <option key={-1} value={-1}>
                  Không có dữ liệu, vui lòng chọn đúng ngày bắt đầu, ngày kết
                  thúc
                </option>
              )}
            </select>
            {errors.workingDays && touched.workingDays ? (
              <div className="text-red-700 text-sm">
                {errors.workingDays as string}
              </div>
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {data !== undefined ? "Sửa Lịch" : "Tạo Lịch"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateWorkingTimesForm;
