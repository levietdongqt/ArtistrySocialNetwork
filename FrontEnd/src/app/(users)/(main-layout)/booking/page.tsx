'use client'
import BookingCalendar, {Booking} from "./service-calendar";
import {ServiceCalendar} from "./aside-service-calendar";
import {DatePicker, Select, Space, TimePicker, TimePickerProps} from "antd";
import {useState} from "react";
import dayjs from "dayjs";

import {RangePickerProps} from "antd/es/date-picker";

const {Option} = Select;

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function BookingPage() {
    const format = 'HH:mm';
    // const onChange: TimePickerProps['onChange'] = (time, timeString) => {
    //     console.log(time, timeString);
    // };
    const [type, setType] = useState<"time" | "date" | "week" | "month" | "quarter" | "year" | undefined>('time');
    const [value, onChange] = useState<Value>(new Date());
    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };
    const disabledDateTime = () => ({
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    });
    const disabledDate: RangePickerProps['disabledDate'] = current => {
        // Can not select days before today and today
        return current && current < dayjs(new Date(Date.now()))
    };
    return (
        <>
            <DatePicker size={'middle'}

                        placeholder={"Chọn ngày"}
                        disabledDate={disabledDate}
                        picker={'date'}
                        format={"DD-MM-YYYY"}
                        onChange={(value) => console.log(value?.toDate())}/>
            <TimePicker
                size={'middle'}
                placeholder={"Chọn giờ"}
                onChange={() => {
                }}
                disabledTime={disabledDateTime}
                format={format}
                showSecond={false}/>
        </>

    );
}