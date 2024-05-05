import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {CustomIcon} from "@components/ui/custom-icon";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";
import {checkPhoneFormat} from "../_components/phone-validate";
import {isExistAccount} from "../../../services/main/auth-service";
import {useOAuth2} from "../../../context/oauth2-context";

interface verifyAccountParam {
    destination?: string
    callback?: () => void;
}

export function VerifyAccount({destination, callback}: verifyAccountParam) {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [error, setError] = useState(false)
    const {captchaVerifier} = useOAuth2()
    const router = useRouter()
    useEffect(() => {
        if (error) {
            setError(false)
        }
    }, [phoneNumber]);
    const handleSubmit = async () => {
        const phoneNumberFinal = checkPhoneFormat(phoneNumber);
        console.log(phoneNumberFinal)
        if (phoneNumberFinal) {
            setError(false)
            toast.promise(isExistAccount(phoneNumberFinal), {
                pending: "Đang xác kiểm tra tài khoản",
                error: "Số điện thoại không hợp lệ!"
            }).then(async isExist => {
                if (isExist) {
                    await captchaVerifier({
                        phoneNumber: phoneNumberFinal,
                        destination: destination,
                        callBack: callback,
                    })
                    return
                } else {
                    showErrorAlert(phoneNumberFinal)
                }
            })
            return
        }
        setError(true)
    }
    const showErrorAlert = (phoneNumber: string) => {
        Swal.fire({
            title: "Oops ...",
            text: `Số ${phoneNumber} chưa được đăng kí! `,
            icon: "warning"
        }).then(value => router.replace("/register"));
    }
    return (
        <>
            <div className="relative  px-10 pt-10 pb-2 ">
                <label
                    className="block uppercase text-slate-600 text-sm font-bold mb-2"
                    htmlFor="grid-password"
                >
                    Số điện thoại
                </label>


                <div className="flex items-center mt-2 mb-4">
                    <div id="dropdown-phone-button" data-dropdown-toggle="dropdown-phone"
                         className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                    >
                        +84
                    </div>
                    <div className="relative w-full">
                        <input type="text" id="phone-input" aria-describedby="helper-text-explanation"
                               className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border-e-0 border-s-0 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                               placeholder="398713843"
                               value={phoneNumber}
                               onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <button id="dropdown-verification-option-button" data-dropdown-toggle="dropdown-verification-option"
                            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                            onClick={handleSubmit}
                    >
                        Kiểm tra
                    </button>

                </div>
                {error && <div className="text-red-700 mt-2 text-sm">Số điện thoại không hợp lệ</div>}
                <div id="recaptcha-container"></div>
            </div>
        </>
    )
}