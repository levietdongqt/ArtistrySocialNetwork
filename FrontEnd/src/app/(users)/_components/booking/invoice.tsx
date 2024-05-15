import {Order} from "@models/order";
import React, {useEffect, useState} from "react";
import {createOrder} from "../../../../services/main/clientRequest/orderClient";
import {toast} from "react-toastify";
import {useUser} from "../../../../context/user-context";

interface props {
    order: Order
    isCreate: boolean
    callback?: () => void
}

export function Invoice({order, callback, isCreate}: props) {
    const {currentUser} = useUser()
    const [noDiscountTotal, setNoDiscountTotal] = useState(0)

    useEffect(() => {
        let total = order.mainService.price;
        order.additionalService?.forEach(value => {
            total += value.price
        })
        setNoDiscountTotal(total)
    }, []);
    const handeCreateOrder = () => {
        toast.promise(createOrder(JSON.stringify(order)), {
            pending: "Đang tạo đơn hàng!",
            success: "Tạo đơn hàng thành công",
            error: "Tạo đơn hàng thất bại"
        }).then(() => {
            callback?.();
        })
    }
    var options: Intl.DateTimeFormatOptions = {
        hour: '2-digit', // Hiển thị giờ dưới dạng hai chữ số
        minute: '2-digit', // Hiển thị phút dưới dạng hai chữ số
        day: '2-digit', // Hiển thị ngày dưới dạng hai chữ số
        month: '2-digit', // Hiển thị tháng dưới dạng hai chữ số
        year: 'numeric' // Hiển thị năm dưới dạng bốn chữ số
    };

// Tạo một đối tượng định dạng ngày tháng
    var dateFormatter = new Intl.DateTimeFormat('en-GB', options);
    return (
        <div className="bg-white rounded-lg shadow-lg px-8 py-10 max-w-xl mx-auto">
            <h2 className="text-2xl text-center font-bold mb-4">{isCreate ? "Xác nhận thông tin" : " Thông tin khách hàng "}</h2>
            <div className="border-b-2 border-gray-300 pb-2 mb-2">
                <div className={"mb-2"}><span
                    className="text-lg font-bold "> Khách hàng: </span> {order.customerUser.fullName}</div>
                <div className={"mb-2"}><span
                    className="text-lg font-bold "> SĐT: </span> 0{order!.metaData.phoneNumber.substring(3)}</div>
                <div className={"mb-2"}><span
                    className="text-lg font-bold "> Thời gian: </span> {isCreate ? dateFormatter.format(new Date(order.startDate.getTime() - 7 * 60 * 60 * 1000)) : dateFormatter.format(order.startDate)}
                </div>
            </div>
            <table className="w-full text-left mb-8">
                <thead>
                <tr>
                    <th className="text-gray-700 font-bold  w-[250px] py-2">DỊCH VỤ</th>
                    <th className="text-gray-700 font-bold  w-[100px] py-2">SỐ LƯỢNG</th>
                    <th className="text-gray-700 font-bold  w-[100px] py-2">GIÁ</th>
                    <th className="text-gray-700 font-bold  w-[100px] py-2">TỔNG</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="py-2 text-gray-700">{order.mainService.name}</td>
                    <td className="py-2 text-gray-700 text-center">{order.amount}</td>
                    <td className="py-2 text-gray-700">{order.mainService.price}</td>
                    <td className="py-2 text-gray-700">{order.mainService.price * order.amount!}đ</td>
                </tr>
                {
                    order.additionalService?.map((extraService) => (
                        <tr key={extraService.id}>
                            <td className="py-2 text-gray-700">{extraService.name}</td>
                            <td className="py-2 text-center text-gray-700">1</td>
                            <td className="py-2 text-gray-700">{extraService.price}</td>
                            <td className="py-2 text-gray-700">{extraService.price}đ</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
            {
                order.promotion && <div className="flex justify-end mb-2">

                        <div className="text-gray-700 mr-2">Giá gốc :</div>
                        <span className={"line-through"}>{noDiscountTotal}</span>đ
                </div>
            }
            <div className="flex justify-end mb-2">
                <div className="text-gray-700 mr-2">Thành tiền:</div>
                <div className="text-gray-700">{order.totalPrice}</div>
                <div
                    className="my-2   flex items-center before:mt-0.5 before:flex-1 before:border-t-2 before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t-2 after:border-neutral-300">
                </div>
            </div>

            {
                isCreate && <div className="flex justify-end mb-5">
                    <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-3xl focus:outline-none focus:shadow-outline"
                        onClick={handeCreateOrder}
                    >
                        Đặt lịch
                    </button>
                </div>
            }
        </div>
    )
}