'use client'
import {useModal} from "@lib/hooks/useModal";
import {useAuth} from "../../../../context/auth-context";
import {useUser} from "../../../../context/user-context";
import {useRouter} from "next/navigation";
import {useFormik} from "formik";
import LoginValidation from "@lib/validations/LoginValidation";
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import {toast} from "react-toastify";
import {loginService, registerService} from "../../../../services/main/auth-service";
import {setCookieHandler} from "@lib/helper/clientCookieHandle";
import {CustomIcon} from "@components/ui/custom-icon";
import RegisterValidation from "@lib/validations/RegisterValidation";

export function FormRegister() {
    const {signInWithFacebook, signInWithGoogle} = useAuth()
    const router = useRouter();
    const [isGetGeolocation, setIsGetGeolocation] = useState(false)
    const {values, touched, handleSubmit, handleChange, errors, isValid, resetForm} = useFormik({
        initialValues: {
            email: '',
            password: '',
            fullName: '',
            rePassword: '',
            isGetGeolocation: false
        },
        onSubmit: values => {
            const {isGetGeolocation, ...formData} = values
            const dataRequest = {
                ...formData,
                roles: ["ROLE_USER"],
            }
            registerHandler(dataRequest)
        },
        validationSchema: RegisterValidation,
    });
    const getGeolocation = () => {
        console.log('getGeolocation')
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position.coords.latitude, ' -  ', position.coords.longitude)
                // setLatitude(position.coords.latitude);
                // setLongitude(position.coords.longitude);
            }, function (error) {
                // setError(error.message);
            });
        } else {
            // setError("Geolocation is not supported by this browser.");
        }
    };
    const registerHandler = (values: {}) => {
        toast.promise(registerService(values), {
            pending: 'Đang đăng kí .....',
            success: "Đăng kí thành công!",
        }).then(result => {
            console.log("Login Result: ", result)
            setCookieHandler(result.data).then(value => {
                router.push("/home")
                return
            });
            return;
        })
            .catch(err => {
                console.log("ERROR LOGIN DONE")
                console.log(err)
            });
    }

    return (
        <>
            <div className="rounded-t mb-0 px-6 pt-6 pb-1">
                <div className="text-center mb-3">
                    <h6 className="text-slate-500 text-sm font-bold">
                        Đăng nhập với
                    </h6>
                </div>
                <div className="btn-wrapper text-center">

                    <button
                        className="mr-6 bg-white active:bg-slate-50 text-slate-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center text-xs ease-linear transition-all duration-150"
                        type="button"
                        onClick={signInWithGoogle}
                    >
                        <CustomIcon iconName='GoogleIcon'/>
                        Google
                    </button>
                    <button
                        className="bg-white active:bg-slate-50 text-slate-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center text-xs ease-linear transition-all duration-150"
                        type="button"
                        onClick={signInWithFacebook}
                    >
                        <CustomIcon iconName='FaceBookIcon'/>
                        FACEBOOK
                    </button>
                </div>
                {/*<hr className="mt-4 border-b-1 border-slate-300"/>*/}
                <div
                    className="my-2 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                    <p className="mx-4 mb-0 text-center font-medium dark:text-neutral-100">
                        Or
                    </p>
                </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-slate-400 text-center mb-3 font-bold">
                    <small>Đăng kí với số điện thoại</small>
                </div>
                <form onSubmit={handleSubmit} method="post">
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Họ tên
                        </label>
                        <input
                            type="text" id="fullName" name="fullName"
                            className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Họ và tên" onChange={handleChange}
                            value={values.fullName}/>
                        {errors.fullName && touched.fullName ?
                            <div className="text-red-700 text-sm ">{errors.fullName}</div> : null}
                    </div>

                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Email
                        </label>
                        <input
                            type="text" id="email" name="email"
                            className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Email hoặc số điện thoại"
                            onChange={handleChange}
                            value={values.email}
                        />
                        {errors.email && touched.email ?
                            <div className="text-red-700 text-sm ">{errors.email}</div> : null}
                    </div>

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
                    <label className="inline-flex items-center cursor-pointer" onClick={getGeolocation}>
                        <input
                            id="isGetGeolocation" name = "isGetGeolocation"
                            type="checkbox"
                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                            onChange={(e) => {
                                handleChange(e);
                                // Cập nhật giá trị của isGetGeolocation tại đây
                            }}
                          />
                        {errors.isGetGeolocation && touched.isGetGeolocation ?
                            <div className="text-red-700 text-sm">{errors.isGetGeolocation}</div> :
                            <span className="ml-2 text-sm font-semibold text-blueGray-600">
                       Chia sẻ ví trị của bạn cho trải nghiệm tốt hơn
                      </span>}
                    </label>
                    <div className="text-center mt-6">
                        <button
                            className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            type="submit"
                        >
                            Đăng kí
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}