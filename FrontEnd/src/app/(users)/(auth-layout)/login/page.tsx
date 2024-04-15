'use client'
import {useModal} from "@lib/hooks/useModal";
import {useOAuth2} from "../../../../context/oauth2-context";
import {useUser} from "../../../../context/user-context";
import {useRouter} from "next/navigation";
import {useFormik} from "formik";
import LoginValidation from "@lib/validations/LoginValidation";
import {useEffect} from "react";
import {getCookie} from "cookies-next";
import {toast} from "react-toastify";
import {loginService} from "../../../../services/main/auth-service";
import {setCookieHandler} from "@lib/helper/clientCookieHandle";
import {CustomIcon} from "@components/ui/custom-icon";
import Link from "next/link";
import {checkPhoneFormat} from "../_components/phone-validate";
import Swal from "sweetalert2";

export default function FormLogin() {
    const {signInWithFacebook, signInWithGoogle} = useOAuth2()
    const router = useRouter();
    const {setCurrentUser} = useUser();
    const {values, touched, handleSubmit, handleChange, errors, isValid, resetForm} = useFormik({
        initialValues: {
            phoneNumber: '',
            password: ''
        },
        onSubmit: values => {
            const finalPhone = checkPhoneFormat(values.phoneNumber);
            if (finalPhone) {
                loginHandler({
                    phoneNumber: finalPhone,
                    password: values.password
                })
            }
            return
        },
        validationSchema: LoginValidation,
    });

    const loginHandler = (values: {}) => {
        toast.promise(loginService(values), {
            pending: 'Đang đăng nhập .....',
            error: 'Thông tin đăng nhập không hợp lệ'
        }).then(result => {
            console.log("Login Result: ", result)
            if (result.status === 401) {
                showToastVerify()
                return;
            }
            toast.success("Đăng nhập thành công")
            setCookieHandler(result.data).then(value => {
                setCurrentUser(result.data.user)
                const prevPage = getCookie("prev_page")?.toString();
                console.log("prevPage: ", prevPage);
                (prevPage && prevPage !== '/login') ? router.push(prevPage) : router.push("/home")
                return
            });
        })
            .catch(err => {
                console.log("ERROR LOGIN DONE")
                console.log(err)
            });
    }
    const showToastVerify = () => {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Tài khoản của bạn chưa được kích hoạt ",
            footer: 'Vui lòng kích hoạt tài khoản <div><a href="/verify/re-verify" class="text-blue-700 underline">  tại đây! </a></div>'
        })
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
                        className="mr-6 bg-white active:bg-slate-50 text-slate-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                        type="button"
                        onClick={signInWithGoogle}
                    >
                        <CustomIcon iconName='GoogleIcon'/>
                        Google
                    </button>
                    <button
                        className="bg-white active:bg-slate-50 text-slate-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
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
                        Hoặc
                    </p>
                </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-slate-400 text-center mb-3 font-bold">
                    <small>Đăng nhập với mật khẩu</small>
                </div>
                <form onSubmit={handleSubmit} method="post">
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Số điện thoại
                        </label>
                        <div className="flex items-center mt-2">
                            <div id="dropdown-phone-button" data-dropdown-toggle="dropdown-phone"
                                 className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                            >
                                +84
                            </div>
                            <div className="relative w-full">
                                <input type="text" id="phoneNumber" aria-describedby="helper-text-explanation"
                                       className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border-e-0 border-s-0 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                       placeholder="398713843"
                                       value={values.phoneNumber}
                                       onChange={handleChange}
                                />
                            </div>
                        </div>
                        {errors.phoneNumber && touched.phoneNumber ?
                            <div className="text-red-700  text-sm">{errors.phoneNumber}</div> : null}
                    </div>

                    <div className="relative w-full mb-0">
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
                            <div className="text-red-700  text-sm">{errors.password}</div> : null}
                    </div>
                    <div className="flex items-center justify-end">
                        <div className=" mt-1.5 mb-1">
                            <Link href={"/verify/re-verify?forgot-pass=true"} className="text-sm text-blue-600 hover:text-blue-500">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-2">
                        <button
                            className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            type="submit"
                        >
                            ĐĂNG NHẬP
                        </button>
                    </div>
                </form>
                <div className="flex items-center justify-end">
                    <div className=" mt-3 mb-1 text-sm">
                        Bạn chưa có tài khoản? &nbsp;
                        <Link href={"/register"} className=" text-blue-600 hover:text-blue-500">
                            Tạo mới bằng số điện thoại
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}