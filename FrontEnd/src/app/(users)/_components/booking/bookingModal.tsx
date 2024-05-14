'use client'
import {Carousel, DatePicker, InputNumber, Tag, TimePicker, Tooltip} from "antd";
import dayjs from "dayjs";
import locale from 'antd/es/date-picker/locale/vi_VN';
import {DayOfWeek} from "@lib/enum/WorkingDay";
import {WorkingTime} from "@models/workingTime";
import React, {useEffect, useState} from "react";
import {InfoButton} from "@chatscope/chat-ui-kit-react";
import {MyTooltip} from "@components/ui/my-tooltip";
import {Order, OrderStatus} from "@models/order";
import {Loading} from "@components/ui/loading";
import {getOrdersBy, getWorkingTimeByProvider} from "../../../../services/main/clientRequest/bookingClient";
import {MainService} from "@models/main-service";
import {toast} from "react-toastify";
import {CustomIcon} from "@components/ui/custom-icon";
import {getExtraServiceByProvider} from "../../../../services/main/clientRequest/service";
import {ExtraService} from "@models/extra-service";
import ExtraServiceCard from "./extra-service-card";
import {Modal} from "../modal/modal";
import {Invoice} from "./invoice";
import {useUser} from "../../../../context/user-context";
import {checkPhoneFormat} from "../../../(auth)/_components/phone-validate";
import {useOAuth2} from "../../../../context/oauth2-context";
import Swal from "sweetalert2";
import {VerifyCode} from "../../../(auth)/verify/verify-code";
import {updateUser} from "../../../../services/main/clientRequest/userClient";
import {User} from "@models/user";

interface props {
    providerId: string;
    mainService: MainService;
    closeModal: () => void;
}

const format = 'HH:mm';
const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
};

export default function BookingModal({providerId, mainService,closeModal}: props) {
    const {currentUser, setCurrentUser} = useUser()
    const {captchaVerifier} = useOAuth2()

    const [showVerifyPhone, setShowVerifyPhone] = useState(false)
    const [mainServiceNumber, setMainServiceNumber] = useState(1)
    const [isShowCaptcha, setIsShowCaptcha] = useState(true)
    const [isEditMainServiceNumber, setIsEditMainServiceNumber] = useState(false)
    const [orderDetail, setOrderDetail] = useState<Order | undefined>()
    const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber?.substring(3) ?? "")
    const [isShowInvoice, setIsShowInvoice] = useState(false)
    const [extraServices, setExtraServices] = useState<ExtraService[]>([])
    const [total, setTotal] = useState(mainService.price)
    const [selectedExtraServices, setSelectedExtraServices] = useState<ExtraService[]>([])
    const [disableTimePicker, setDisableTimePicker] = useState(true)
    const [showTimePickerTooltip, setShowTimePickerTooltip] = useState(true)
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs(new Date()))
    const [isValidSelected, setIsValidSelected] = useState(false)
    const [bookingEndDate, setBookingEndDate] = useState<dayjs.Dayjs>()
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
        getExtraServiceByProvider(providerId).then((response) => {
            console.log("ExtraService: ", response.data)
            if (response.data || response.data.length > 0) {
                setExtraServices(response.data as ExtraService[]);
            }
        })
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
                const timeSlotEnd = timeSlotStart.add(mainService.duration * 60 - 1, 'minute');
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
            if (current.date() === 19) {
                // console.log("TEST: ",isWithinPeriod,isWorkingDay,currentDay,workingTime.workingDays)
            }
            return isWithinPeriod && isWorkingDay;
        });
        // Check if the day is within any of the provider's working periods and is a working day
        return result
    };
    const onChangeDatePicker = async (value: dayjs.Dayjs | null | undefined) => {
        if (!value) {
            return;
        }
        const requestBody = JSON.stringify({
            providerId: providerId,
            bookingDate: value?.add(7, 'h').toISOString()
        })
        console.log("onChangeDatePicker", requestBody)

        const response = await getOrdersBy(requestBody);
        console.log("orders: ", response.data)
        setOrders(response.data)
        setDisableTimePicker(!value)
        setSelectedDate(value!)
        setShowTimePickerTooltip(!value)
        value && setSelectedDate(value)
    }

    const onChangeTimePicker = async (value: dayjs.Dayjs | null | undefined) => {
        if (!value) {
            setIsValidSelected(false);
            return
        }
        const newDate = selectedDate.set('hour', value.hour()).set('minute', value.minute())
        setSelectedDate(newDate)
        setIsValidSelected(true)
        setBookingEndDate(newDate.add(mainService.duration * 60, 'minute'))

    }

    let toastId: any;
    const onSendRequest = async () => {
        if (!isValidSelected) {
            if (toast.isActive(toastId))
                return
            toastId = toast.warning("Vui lòng chọn thời gian!")
            return
        }
        const phoneFinal = checkPhoneFormat(phoneNumber)
        if (!phoneFinal) {
            if (toast.isActive(toastId))
                return
            toastId = toast.warning("Số điện thoại không hợp lệ!")
            return
        }
        const durationSchedule = mainService.duration * mainServiceNumber
        const order: Order = {
            additionalService: selectedExtraServices,
            created: new Date(Date.now() + 1000 * 60 * 7),
            customerUser: currentUser!,
            endDate: selectedDate.add(7, 'hour').add(durationSchedule * 60, 'minute').toDate(),
            mainService: mainService,
            promotion: undefined,
            totalPrice: total,
            amount: mainServiceNumber,
            providerUser: mainService.provider!,
            startDate: selectedDate.add(7, 'hour').toDate(),
            status: OrderStatus.PENDING,
        }

        if (phoneFinal != currentUser?.phoneNumber) {
            Swal.fire({
                    title: "Thay đổi số điện thoại?!",
                    text: "Chúng tôi sẽ thực hiện xác thực số điện thoại mới của bạn! ",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Quay lại"
                }
            ).then(async (result) => {
                if (result.isConfirmed) {
                    await captchaVerifier({
                        phoneNumber: phoneFinal,
                        callBack: () => {
                            console.log("Verify phone number")
                            setIsShowCaptcha(false)
                            setOrderDetail(order)
                            setShowVerifyPhone(true)
                        },
                    })
                }
            });
            return;
        }
        setOrderDetail(order)
        setIsShowInvoice(true)
    }

    const onSelectedExtraService = (extraService: ExtraService) => {
        const index = selectedExtraServices.findIndex(value => value.id === extraService.id);
        let newSelectedExtra = [...selectedExtraServices]
        if (index !== -1) {
            return;
        }
        setTotal(prevState => prevState + extraService.price)
        newSelectedExtra.push({...extraService} as ExtraService)
        setSelectedExtraServices(newSelectedExtra);
    }

    const handleRemoveExtraService = (extraService: ExtraService) => {
        const index = selectedExtraServices.findIndex(value => value.id === extraService.id);
        let newSelectedExtra = [...selectedExtraServices]
        if (index === -1) {
            return;
        }
        setTotal(prevState => prevState - extraService.price)
        newSelectedExtra.splice(index, 1)
        setSelectedExtraServices(newSelectedExtra);
    }
    const verifyCodeCallBack = async () => {
        const requestBody = {
            id: currentUser?.id,
            phoneNumber: checkPhoneFormat(phoneNumber),
            roles: currentUser?.roles,
            phoneConfirmed: true
        }
        const response = await updateUser(requestBody)
        if (response.status === 200) {
            setCurrentUser(response.data as User)
            setShowVerifyPhone(false)
            setIsShowInvoice(true)
            return;
        }
        toast.error("Có lỗi xảy ra, vui lòng thử lại!")
        window.location.reload();
    }
    return (
        <>
            <Modal open={isShowInvoice} closeModal={() => setIsShowInvoice(false)}>
                <Invoice order={orderDetail!} callback={() => {
                    setIsShowInvoice(false);
                    closeModal?.()
                }}/>
            </Modal>
            <Modal
                modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
                open={showVerifyPhone} closeModal={() => setShowVerifyPhone(false)}>
                <VerifyCode callback={() => verifyCodeCallBack()}/>
            </Modal>
            {
                isLoading ? <Loading/> :
                    <div className={'flex-col'}>

                        <h2 className={' font-bold text-3xl text-black text-center'}>ĐẶT CHỖ </h2>
                        <div className={"mt-2 text-center"}>
                            {mainService.name}
                        </div>

                        <div className={"flex justify-between mt-7  "}>
                            <div>
                                <span className={"font-bold  text-black"}>Nhà cung cấp: </span>
                                {mainService.provider?.fullName}
                            </div>
                            <div>
                                <span className={"font-bold  text-black"}>Liên hệ: </span>
                                0{mainService.provider?.phoneNumber?.substring(3)}
                            </div>
                        </div>
                        <div className={"mt-2"}>
                            <span className={"font-bold  text-black"}>Địa chỉ: </span>
                            {mainService.provider?.address}
                        </div>
                        <div
                            className="my-2  flex items-center before:mt-0.5 before:flex-1 before:border-t-2 before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t-2 after:border-neutral-300">
                        </div>

                        <div className={"flex justify-start mt-7"}>
                            <div className="w-[50%] ">
                                <div className="">
                                    <label
                                        className="block uppercase text-slate-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password"
                                    >
                                        Số điên thoại
                                    </label>
                                    <div className="flex items-center mt-2">
                                        <div id="dropdown-phone-button" data-dropdown-toggle="dropdown-phone"
                                             className="flex-shrink-0 z-10 inline-flex items-center py-2 px-2 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                                        >
                                            +84
                                        </div>
                                        <div className="relative w-full">
                                            <input type="text" id="phoneNumber"
                                                   aria-describedby="helper-text-explanation"
                                                   className="block px-2 py-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg  border-s-0 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                                   placeholder=" Số điện thoại.... "
                                                   value={phoneNumber}
                                                   onChange={(event) => setPhoneNumber(event.target.value)}
                                                // onBlur={event => checkExistAccount(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'flex flex-row mt-2'}>
                            <div className={'flex-col w-1/2  mt-0.5 '}>
                                <div className={"mb-2"}>Chọn ngày</div>
                                <DatePicker size={'middle'}
                                            className={"w-[100%]"}
                                            locale={locale}
                                            placeholder={"Chọn ngày"}
                                            direction={"ltr"}
                                            disabledDate={disabledDate}
                                            picker={'date'}
                                            format={"DD-MM-YYYY"}
                                            showNow={true}
                                            onChange={(value) => onChangeDatePicker(value)}/>
                            </div>
                            <div className={'flex justify-end  w-1/2'}>
                                <div className={'flex-col w-[70%]'}>
                                    <div>Giờ bắt đầu
                                        <MyTooltip
                                            content={"Thời gian không hợp lệ sẽ bị ẩn đi !"}>
                                            <button className="relative overflow-hidden ">
                                <span
                                    className="block w-full h-full bg-gray-200 rounded-full opacity-0 transition-opacity duration-300 absolute inset-0 hover:opacity-50">
                                </span>
                                                <InfoButton/>
                                            </button>
                                        </MyTooltip>
                                    </div>
                                    <Tooltip title={showTimePickerTooltip && "Vui lòng chọn ngày!"}>
                                        <TimePicker
                                            locale={locale}
                                            className={"w-full"}
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

                                </div>
                            </div>


                        </div>

                        <div className={"flex justify-between mt-2   "}>
                            <div>

                                <span className={" text-black"}>Số lượng: </span>
                                {
                                    isEditMainServiceNumber ?
                                        <InputNumber min={1}
                                                     max={Math.floor(16 / mainService.duration)}
                                                     className={'w-12 mr-3'}
                                                     value={mainServiceNumber}
                                                     onChange={(value) => setMainServiceNumber(value!)}
                                        />
                                        :
                                        <span className={"mr-3"}>{mainServiceNumber}</span>
                                }
                                {!isEditMainServiceNumber && <Tooltip title={"Chỉnh sửa"}>
                                    <button
                                        className="text-slate-500 font-bold"
                                        onClick={() => {
                                            setIsEditMainServiceNumber(true)
                                        }}
                                    >
                                        <CustomIcon iconName={'IconBxsPencil'}/>
                                    </button>
                                </Tooltip>}
                            </div>
                            <div className={"pt-1.5"}>
                                <span className={" text-black"}>Thời gian: </span>
                                {~~mainService.duration * mainServiceNumber}h
                                {mainService.duration - Math.floor(mainService.duration) > 0 ? `${(mainService.duration - Math.floor(mainService.duration)) * 60}p` : ''}
                            </div>
                        </div>
                        {
                            selectedExtraServices.length > 0 && <div className={'mt-2  text-black '}>
                                Dịch vụ kèm theo
                            </div>
                        }
                        {
                            selectedExtraServices?.map((extraService) => {
                                return (
                                    <span key={extraService.id} style={{display: 'inline-block'}}>
                                  <Tag
                                      closable
                                      onClose={(e) => {
                                          e.preventDefault();
                                          handleRemoveExtraService(extraService);
                                      }}
                                  >
                                    {extraService.name}
                                    </Tag>
                            </span>
                                )
                            })
                        }

                        <div className="flex  justify-end mt-2">
                            <div>

                                <div className="">
                                    Tổng: {total}đ
                                </div>
                                <div
                                    className="my-2   flex items-center before:mt-0.5 before:flex-1 before:border-t-2 before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t-2 after:border-neutral-300">
                                </div>
                                {
                                    isShowCaptcha && <div className="mx-auto">
                                        <div id="recaptcha-container" className="my-5"></div>
                                    </div>
                                }
                                <div className={"mt-2 flex justify-end"}>
                                    <button
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-3xl focus:outline-none focus:shadow-outline"
                                        onClick={onSendRequest}
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div
                            className="my-2  flex items-center before:mt-0.5 before:flex-1 before:border-t-2 before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t-2 after:border-neutral-300">
                        </div>
                        <div>
                            {
                                extraServices.length > 0 && <div className={"font-bold text-black"}>
                                    Đề xuất
                                </div>
                            }
                            <Carousel autoplay arrows={true} className={""}>
                                {
                                    extraServices && extraServices.map((extraService: ExtraService, index) => {
                                        console.log("HELLO: ", extraServices)
                                        return (
                                            <div key={index} className={'bg-dark-primary max-h-[100px] rounded-2xl'}>
                                                <ExtraServiceCard data={extraService}
                                                                  callback={onSelectedExtraService}/>
                                            </div>
                                        )
                                    })
                                }
                            </Carousel>
                        </div>


                    </div>

            }
        </>
    );
}