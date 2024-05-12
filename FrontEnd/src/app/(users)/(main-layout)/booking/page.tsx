'use client'
import {DatePicker, TimePicker, Tooltip} from "antd";
import dayjs from "dayjs";
import locale from 'antd/es/date-picker/locale/vi_VN';
import {DayOfWeek} from "@lib/enum/WorkingDay";
import {WorkingTime} from "@models/workingTime";
import React, {useEffect, useState} from "react";
import {InfoButton} from "@chatscope/chat-ui-kit-react";
import {MyTooltip} from "@components/ui/my-tooltip";
import {Order} from "@models/order";
import {getOrdersBy, getWorkingTimeByProvider} from "../../../../services/main/clientRequest/bookingClient";
import {Loading} from "@components/ui/loading";

interface props {
    providerId: string;
}

const format = 'HH:mm';
const minutesDuration = 90;
const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
};
export default function BookingPage() {

    const providerId = "7aac6b78-49b0-492a-a653-976bc56df03d"

    const [disableTimePicker, setDisableTimePicker] = useState(true)
    const [showTimePickerTooltip, setShowTimePickerTooltip] = useState(true)
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs(new Date()))
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [providerWorkingTimes, setProviderWorkingTimes] = useState<WorkingTime[]>([])

    useEffect(() => {
        console.log("BookingPage Mount")
        getWorkingTimeByProvider(JSON.stringify({"providerId": providerId})).then(response => {
            response.data.forEach((workingTime: WorkingTime) => {
                workingTime.startDate = new Date(workingTime.startDate)
                workingTime.endDate = new Date(workingTime.endDate)
                workingTime.workingDays = workingTime.workingDays.map(item => item as DayOfWeek)
            })
            setProviderWorkingTimes(response.data)
            setIsLoading(false)
        });
    }, []);

    useEffect(() => {
        console.log("isLoading: ", isLoading)
    }, [isLoading]);
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
                        console.log("startTime: ", `${hour}:${minute}`, order.startDate, order.endDate)

                    }
                    return (!timeSlotStart.isAfter(order.startDate) && !timeSlotEnd.isAfter(order.startDate))
                        || (!timeSlotStart.isBefore(order.endDate) && !timeSlotEnd.isBefore(order.endDate))
                })
                // if (!isNotOverlapOrders) {
                //     handlePushDisableTime(disabledHours, [hour])
                // }
                if (!isNotOverlapOrders) {
                    handlePushDisableTime(disabledMinutes[hour], [minute]);
                }
            }
            // console.log("disabled minutes: ", disabledMinutes[hour].length !== 60 && hour)
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

    const disabledDate = (current: dayjs.Dayjs) => {
        const today = dayjs(new Date()).startOf('day');
        const oneMonthLater = dayjs(new Date()).add(1, 'month');

        // Check if the day is before today or after one month from today
        if (current.isBefore(today, 'day') || current.isAfter(oneMonthLater, 'day')) {
            return true;
        }
        const result = !providerWorkingTimes.some((workingTime: WorkingTime) => {
            const isWithinPeriod = current.endOf('day').valueOf() >= workingTime.startDate.getTime() && current.startOf('day').valueOf() <= workingTime.endDate.getTime()
            const currentDay = current.format('dddd').toUpperCase() as DayOfWeek

            const isWorkingDay = workingTime.workingDays
                .includes(currentDay);
            if(current.date() === 19){
                // console.log("TEST: ",isWithinPeriod,isWorkingDay,currentDay,workingTime.workingDays)
            }
            return isWithinPeriod &&  isWorkingDay;
        });
        // Check if the day is within any of the provider's working periods and is a working day
        return result
    };

    const onChangeDatePicker = async (value: dayjs.Dayjs | null) => {
        const requestBody = JSON.stringify({
            providerId: providerId,
            bookingDate: value?.add(7,'h').toISOString()
        })
        console.log("onChangeDatePicker",requestBody)

        const response = await getOrdersBy(requestBody);
        console.log("orders: ", response.data)
        setOrders(response.data)
        setDisableTimePicker(!value)
        setSelectedDate(value!)
        setShowTimePickerTooltip(!value)
        value && setSelectedDate(value)
    }

    const onChangeTimePicker = async (value: dayjs.Dayjs) => {
        const newDate = selectedDate.set('hour',value.hour()).set('minute',value.minute())
        setSelectedDate(newDate)
    }

    return (
        isLoading ? <Loading/> :
            <>
                <DatePicker size={'middle'}
                            locale={locale}
                            placeholder={"Chọn ngày"}
                            direction={"ltr"}
                            disabledDate={disabledDate}
                            picker={'date'}
                            format={"DD-MM-YYYY"}
                            showNow={true}
                            onChange={(value) => onChangeDatePicker(value)}/>
                <Tooltip title={showTimePickerTooltip && "Vui lòng chọn ngày!"}>
                    <TimePicker
                        locale={locale}
                        size={'middle'}
                        placeholder={"Chọn giờ"}
                        showNow={false}
                        onChange={(value) => {
                            onChangeTimePicker(value)
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