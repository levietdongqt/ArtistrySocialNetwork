'use client'
import {VerifyCode} from "../verify-code";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";

export default function Continue() {
    const {get} = useSearchParams()
    const [destination, setDestination] = useState("");
    useEffect(() => {
        const searchParam = get("forgot-pass")
        if (searchParam) {
            setDestination("/verify/forgot-pass");
        }else{
            setDestination("/login")
        }
    }, []);
    return (
        <>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div>
                    <h1 className="uppercase text-slate-800 text-xl font-bold pt-10 text-center ">Xác thực số điện thoại
                        của
                        bạn</h1>
                </div>
                <VerifyCode destination={destination}/>
            </div>
        </>
    )
}