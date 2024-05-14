'use client'
import {useEffect, useState} from "react";
import {VerifyAccount} from "../verify-account";
import {useSearchParams} from "next/navigation";

export default function ReVerify() {
    const {get} = useSearchParams();
    const [destination, setDestination] = useState("");
    useEffect(() => {
        const searchParam = get("forgot-pass")
        if (searchParam) {
            setDestination("/verify/continue?forgot-pass=true");
        }else{
            setDestination("/verify/continue")
        }
    }, []);
    return (
        <>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div>
                    <h1 className="uppercase text-slate-800 text-xl font-bold pt-10 text-center ">
                        Kiểm tra tài khoản tồn tại?
                    </h1>
                </div>
                {
                    <VerifyAccount destination={destination}/>
                }
            </div>
        </>
    )
}