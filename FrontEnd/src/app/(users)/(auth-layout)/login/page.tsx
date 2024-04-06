import {LoginMain} from '../_components/login-main';
import {getCookie} from "cookies-next";
import {cookies} from "next/headers";
import LoginValidation from "@lib/validations/LoginValidation";
import {ReactElement} from "react";
import {redirect} from 'next/navigation'
import Link from "next/link";
import {CustomIcon} from "@components/ui/custom-icon";
import {FormLogin} from "../_components/form-login";


export default async function Login() {
    return (
        <>
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-4/12 px-4">
                        <div
                            className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-200 border-0">
                           <FormLogin/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


