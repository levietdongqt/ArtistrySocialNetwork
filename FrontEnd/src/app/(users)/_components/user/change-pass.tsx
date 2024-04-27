'use client'
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";
import {useFormik} from "formik";
import RegisterValidation from "@lib/validations/ForgotPassValidation";
import {toast} from "react-toastify";
import {getCookie} from "cookies-next";
import {changePassword} from "../../../../services/main/auth-service";
interface  Proptype {
    phoneNum: string;
    callback:()=> void;
}

export default function ChangePass({phoneNum,callback}: Proptype) {
    const router = useRouter()


    const {values, touched, handleSubmit, handleChange, errors, isValid, resetForm} = useFormik({
        initialValues: {
            rePassword: '',
            password: ''
        },
        onSubmit: values => {
            console.log("ON Submit")

            showConfirmation({password: values.password, phoneNumber: phoneNum})
        },
        validationSchema: RegisterValidation,
    });

    const showConfirmation = (data: {}) => {
        Swal.fire({
            title: " Mật khẩu sẽ được thay đổi? ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Huỷ bỏ"
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(changePassword(data), {
                    pending: "Đang đổi mật khẩu ...",
                    success: " Đổi mật khẩu thành công!",
                    error: "Đổi mật khẩu thất bại! "
                }).then(value => callback())
            }
        });
    }
    return (
        <>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-amber-50">
                <div>
                    <h1 className="uppercase text-slate-800 text-xl font-bold pt-10 text-center ">
                        Tạo mật khẩu mới
                    </h1>
                </div>
                <form method="post" onSubmit={handleSubmit}>
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Mật khẩu
                        </label>
                        <input
                            type="password" id="password" name="password"
                            className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Mật khẩu"
                            onChange={handleChange}
                            value={values.password}/>
                        {errors.password && touched.password ?
                            <div className="text-red-700 text-sm">{errors.password}</div> : null}
                    </div>

                    <div className="relative w-full mb-5">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password" id="rePassword" name="rePassword"
                            className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Mật khẩu"
                            onChange={handleChange}
                            value={values.rePassword}/>
                        {errors.rePassword && touched.rePassword ?
                            <div className="text-red-700 text-sm">{errors.rePassword}</div> : null}
                    </div>
                    <div className="text-center mt-6">
                        <button
                            className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            type="submit"
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}