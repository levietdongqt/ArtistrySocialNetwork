'use client'

import {toast} from "react-toastify";

export function errorAlert(message?: string) {
    toast.error(message || " Có lỗi xảy ra, vui lòng thử lại!")
    window.location.reload()
}