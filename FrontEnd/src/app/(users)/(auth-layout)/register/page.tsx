'use client'
import {useModal} from "@lib/hooks/useModal";
import {useOAuth2} from "../../../../context/oauth2-context";
import {useUser} from "../../../../context/user-context";
import {useRouter} from "next/navigation";
import {useFormik} from "formik";
import LoginValidation from "@lib/validations/LoginValidation";
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import {toast} from "react-toastify";
import {isExistAccount, loginService, registerService} from "../../../../services/main/auth-service";
import {setCookieHandler} from "@lib/helper/clientCookieHandle";
import {CustomIcon} from "@components/ui/custom-icon";
import RegisterValidation from "@lib/validations/RegisterValidation";
import CustomModal from "@components/modals/CreateModal";
import {DisplayModalLogin} from "../../_components/modal/display-modal-login";
import {checkPhoneFormat} from "../_components/phone-validate";

export default function Register() {
    const {signInWithFacebook, signInWithGoogle, captchaVerifier} = useOAuth2()
    const router = useRouter();
    const [errorExistAccount, setErrorExistAccount] = useState(false)
    const [showValidPhone, setShowValidPhone] = useState(false)
    const [isShowCapcha, setIsShowCapcha] = useState(false)
    const [finalPhone, setFinalPhone] = useState("")
    const [isGetGeolocation, setIsGetGeolocation] = useState(false)
    let {values, touched, handleSubmit, handleChange, errors, isValid, resetForm} = useFormik({
        initialValues: {
            phoneNumber: '',
            password: '',
            fullName: '',
            rePassword: '',
            isGetGeolocation: false
        },
        onSubmit: async values => {
            console.log(showValidPhone)
            if (!showValidPhone) {
                return
            }
            const {isGetGeolocation, phoneNumber, ...formData} = values
            const dataRequest = {
                phoneNumber: finalPhone,
                ...formData,
                roles: ["ROLE_USER"],
            }
            await registerHandler(dataRequest)
        },
        validationSchema: RegisterValidation,
    });
    useEffect(() => {
        if (errors.phoneNumber) {
            setShowValidPhone(false)
            setErrorExistAccount(false)
        }
    }, [errors.phoneNumber]);

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
    const registerHandler = async (data: any) => {
        const register = () => {
            toast.promise(registerService(data), {
                pending: 'Đang đăng kí tài khoản .....',
                success: "Đăng kí tài khoản thành công!",
            }).then(result => {
                return;
            })
                .catch(err => {
                    console.log("ERROR LOGIN DONE")
                    console.log(err)
                });
        }
        await captchaVerifier({
            phoneNumber: finalPhone,
            callBack: register
        }).then(value => {
            setIsShowCapcha(true)
        })
    }
    const checkExistAccount = async (phoneNumber: string) => {
        const phoneNumberFinal = checkPhoneFormat(phoneNumber);
        if (phoneNumberFinal) {
            const isExist = await isExistAccount(phoneNumberFinal)
            if (isExist) {
                setErrorExistAccount(true)
                setShowValidPhone(false)
                return
            }
            setShowValidPhone(true)
            setFinalPhone(phoneNumberFinal)
        }
        setErrorExistAccount(false)
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
                            Số điên thoại
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
                                       onBlur={event => checkExistAccount(event.target.value)}
                                />
                            </div>
                        </div>
                        {
                            errorExistAccount &&
                            <div className="text-red-700 text-sm ">Số điện thoại đã được đăng kí</div>
                        }
                        {
                            showValidPhone &&
                            <div className="text-blue-700 text-sm ">Bạn có thể đăng kí với số điện thoại này</div>
                        }
                        {errors.phoneNumber && touched.phoneNumber ?
                            <div className="text-red-700 text-sm ">{errors.phoneNumber}</div> : null}

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
                            id="isGetGeolocation" name="isGetGeolocation"
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
                    <div className="mx-auto">
                        <div id="recaptcha-container" className="my-5"></div>
                    </div>
                    {!isShowCapcha &&
                        <div className="text-center mt-6">
                            <button
                                className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                type="submit"
                            >
                                Đăng kí
                            </button>
                        </div>
                    }
                </form>

            </div>
        </>
    )
}