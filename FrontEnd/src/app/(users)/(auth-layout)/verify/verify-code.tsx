'use client'
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import Link from "next/link";
import {verifyPhoneNumber} from "../../../../services/main/auth-service";

interface verifyCodeParam {
    destination?: string;
}

export function VerifyCode({destination = "/login"}: verifyCodeParam) {
    const router = useRouter()
    const [secretCode, setSecretCode] = useState("")
    const [error, setError] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState(getCookie("phone_number") || undefined)
    const [reShowVerifyAccount, isReShowVerifyAccount] = useState(false)

    useEffect(() => {
        if (error) {
            setError(false)
        }
    }, [secretCode]);
    useEffect(() => {
        setTimeout(
            () => {
                console.log("HELLO TIMEOUT")
                isReShowVerifyAccount(true)
            }, 50000
        )
        if (!window.confirmationResult) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Phiên làm việc đã hết hạn! ",
                footer: 'Bạn đã có tài khoản? Xác thực lại <div><a href="/verify/re-verify" class="text-blue-700 underline">  tại đây! </a></div>'
            }).then(r => router.push('/register'));
        }
    }, []);
    const handleSubmit = () => {
        const regex = /^\d{6}$/;
        if (regex.test(secretCode)) {
            setError(false)
            toast.promise(window.confirmationResult.confirm(secretCode), {
                pending: "Đang xác thực.... ",
                success: "Xác thực thành công!",
                error: "Mã xác thực không hợp lệ!"
            }).then(result => {
                destination === "/login" ? verifyPhoneNumber(result.user.phoneNumber!) : false
                console.log("Verification Result: ", result)
                router.push(destination)
                window.close()
                return
            })
            return
        }
        setError(true)
        console.log("Code không hợp lệ")
    }
    return (
        <>
            <div className="relative  px-10 pt-10 pb-2 ">
                <label
                    className="block uppercase text-slate-600 text-sm font-bold mb-2"
                    htmlFor="grid-password"
                >
                    Mã xác thực
                </label>
                <input
                    type="text" id="password" name="password"
                    className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Mã xác thực từ số điện thoại "
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                />
                {error && <div className="text-red-700 mt-2 text-sm">Mã xác thực không hợp lệ!</div>}
            </div>
            {reShowVerifyAccount ?
                <div className="text-red-700 mt-2 text-sm px-10">
                    Bạn chưa nhận được mã xác thực? Vui lòng kiểm tra số điện thoại và
                    <a className="text-blue-700" href="/verify/re-verify"> thử lại </a>
                </div>
                :
                <div className="text-blue-700 mt-2 text-sm px-10">Mã xác thực đã được gửi tới số điện thoại của bạn,
                    vui
                    lòng kiểm tra điện thoại!
                </div>
            }

            <div className="text-center mt-2  px-10">
                <button
                    className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    onClick={handleSubmit}
                >
                    Xác thực
                </button>
            </div>
        </>
    )
}