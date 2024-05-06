'use client'
import {ConfigProvider, DatePicker, Select, TimePicker, Tooltip} from "antd";
import dayjs from "dayjs";
import locale from 'antd/es/date-picker/locale/vi_VN';
import {RangePickerProps} from "antd/es/date-picker";
import {DayOfWeek} from "@lib/enum/WorkingDay";
import {WorkingTime} from "@models/workingTime";
import React, {useState} from "react";
import {CustomIcon} from "@components/ui/custom-icon";
import {InfoButton} from "@chatscope/chat-ui-kit-react";
import {MyTooltip} from "@components/ui/my-tooltip";

const {Option} = Select;

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
const format = 'HH:mm';
const minutesDuration = 90;
export default function BookingPage() {
    const [disableTimePicker, setDisableTimePicker] = useState(true)
    const [showTimePickerTooltip, setShowTimePickerTooltip] = useState(true)
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs(new Date()))
    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    const orders = [
        {startTime: new Date('2024-05-06T08:00:00'), endTime: new Date('2024-05-06T11:00:00')},
        {startTime: new Date('2024-05-06T12:30:00'), endTime: new Date('2024-05-06T13:30:00')},
        {startTime: new Date('2024-05-06T16:00:00'), endTime: new Date('2024-05-06T17:00:00')},
        // Thêm các order khác nếu cần
    ];
    const handlePushDisableTime = (list: number[], disableTimes: number[]) => {
        disableTimes.forEach(item => {
            if (!list.includes(item)) {
                list.push(item)
            }
        })
    }

    const getDisabledTime = () => {
        const disabledHours: number[] = [];
        const disabledMinutes: Record<number, number[]> = {};
        // Tìm giờ làm việc cho nhà cung cấp vào ngày được chọn
        const todayWorkingTime = providerWorkingTimes.find(workingTime => {
            return selectedDate.valueOf() >= workingTime.startDate.getTime()
                && selectedDate.valueOf() <= workingTime.endDate.getTime()
        })!;
        const hourStart = todayWorkingTime.startDate.getHours()
        const hourEnd = todayWorkingTime.endDate.getHours()
        const minusEnd = todayWorkingTime.endDate.getMinutes()
        handlePushDisableTime(disabledHours, range(0, hourStart - 1))
        handlePushDisableTime(disabledHours, minusEnd > 0 ? range(hourEnd + 1, 23) : range(hourEnd, 23))
        const minusDisableDefault = [
            ...range(1, 14),
            ...range(16, 29),
            ...range(31, 44),
            ...range(46, 59)
        ]
        for (let hour = hourStart; hour < (minusEnd > 0 ? hourEnd + 1 : hourEnd); hour++) {
            if (!disabledMinutes[hour]) {
                disabledMinutes[hour] = [];
            }
            handlePushDisableTime(disabledMinutes[hour], minusDisableDefault)
            for (let minute = 0; minute < 60; minute += 15) {
                const timeSlotStart = selectedDate.hour(hour).minute(minute).second(0);
                const timeSlotEnd = timeSlotStart.add(minutesDuration - 1, 'minute');
                const isNotOverlapOrders = orders.every(order => {
                    if (hour === 11 && minute < 3) {
                        console.log("timeSlotStart: ", `${hour}:${minute}`, timeSlotStart.toDate(), timeSlotEnd.toDate())
                        console.log("startTime: ", `${hour}:${minute}`, order.startTime, order.endTime)

                    }
                    return (!timeSlotStart.isAfter(order.startTime) && !timeSlotEnd.isAfter(order.startTime))
                        || (!timeSlotStart.isBefore(order.endTime) && !timeSlotEnd.isBefore(order.endTime))
                })

                // if (!isNotOverlapOrders) {
                //     handlePushDisableTime(disabledHours, [hour])
                // }
                if (!isNotOverlapOrders) {
                    handlePushDisableTime(disabledMinutes[hour], [minute]);
                }
            }
            console.log("disabled minutes: ", disabledMinutes[hour].length !== 60 && hour)
            // Nếu tất cả các phút trong giờ đều bị disable, thì thêm giờ này vào danh sách disabledHours
            if (disabledMinutes[hour]?.length === 60) {
                handlePushDisableTime(disabledHours, [hour])
                // delete disabledMinutes[hour];
            }
        }

        return {
            disabledHours: () => disabledHours,
            disabledMinutes: (selectedHour: number) => disabledMinutes[selectedHour] || [...range(0, 59)],
        };
    };


    const onChangeDatePicker = (value: dayjs.Dayjs | null) => {
        console.log("onChangeDatePicker", value?.toDate())
        setDisableTimePicker(!value)
        setShowTimePickerTooltip(!value)
        value && setSelectedDate(value)
    }
    // const disabledDateTime = () => ({
    //     disabledHours: () => range(0, 24).splice(4, 20),
    //     disabledMinutes: () => range(30, 60),
    //     disabledSeconds: () => [55, 56],
    // });
    const providerWorkingTimes: WorkingTime[] = [
        {
            id: 1,
            startDate: new Date(2024, 4, 6, 8, 0),
            endDate: new Date(2024, 4, 19, 16, 0),

            workingDays: [DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday],
            status: true,
            providerId: "1"
        },
        {
            id: 2,
            startDate: new Date(2024, 4, 20, 8, 0),
            endDate: new Date(2024, 4, 26, 16, 0),
            workingDays: [DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday],
            status: true,
            providerId: "1"
        }
    ]
    const disabledDate = (current: dayjs.Dayjs) => {
        const today = dayjs(new Date()).startOf('day');
        const oneMonthLater = dayjs(new Date()).add(1, 'month');

        // Check if the day is before today or after one month from today
        if (current.isBefore(today, 'day') || current.isAfter(oneMonthLater, 'day')) {
            return true;
        }
        // Check if the day is within any of the provider's working periods and is a working day
        return !providerWorkingTimes.some((workingTime: WorkingTime) => {
            const isWithinPeriod = current.valueOf() >= workingTime.startDate.getTime() && current.valueOf() <= workingTime.endDate.getTime()
            const currentDay = current.format('dddd') as DayOfWeek
            const isWorkingDay = workingTime.workingDays
                .includes(currentDay);
            return isWithinPeriod && isWorkingDay;
        });
    };

    return (
        <>
            <DatePicker size={'middle'}
                        locale={locale}
                        placeholder={"Chọn ngày"}
                        direction={"ltr"}
                        disabledDate={disabledDate}
                        picker={'date'}
                        format={"DD-MM-YYYY"}
                        showNow={true}
                        showToday={true}
                        onChange={(value) => onChangeDatePicker(value)}/>
            <Tooltip title={showTimePickerTooltip && "Vui lòng chọn ngày!"}>
                <TimePicker
                    locale={locale}
                    size={'middle'}
                    placeholder={"Chọn giờ"}
                    showNow={false}
                    onChange={() => {
                    }}
                    hideDisabledOptions={true}
                    disabled={disableTimePicker}
                    disabledTime={getDisabledTime}
                    format={format}
                    showSecond={false}/>
            </Tooltip>
            <MyTooltip
                content={"Thời gian không hợp lệ sẽ được tự động tính toán!"}>
                <button className="relative overflow-hidden">
                            <span
                                className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                            </span>
                    <InfoButton/>
                </button>
            </MyTooltip>
            <Tooltip title={"Không thể chọn trường này"}>
                <TimePicker
                    locale={locale}
                    size={'middle'}
                    placeholder={""}
                    disabled={true}
                    value={dayjs('00;00', 'HH:mm')}
                    format={format}
                    showSecond={false}/>
            </Tooltip>
        </>

    );
}