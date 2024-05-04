'use client'
import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    PhoneAuthProvider,
    signInWithPhoneNumber,
    signOut as signOutFirebase, getAuth, Auth,
    RecaptchaVerifier,
    ConfirmationResult
} from 'firebase/auth';
import {auth} from '../firebase/app';
import {createContext, ReactNode, useContext, useState} from 'react';
import {oauth2Service} from "../services/main/auth-service";
import {getCookie, setCookie} from "cookies-next";
import {setCookieHandler} from "@lib/helper/clientCookieHandle";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
        confirmationResult: ConfirmationResult;
    }
}

interface captchaVerifierParam {
    phoneNumber: string,
    destination?: string,
    callBack?: () => void
}

type Oauth2Context = {
    signInWithGoogle: () => Promise<void>;
    signInWithFacebook: () => Promise<void>;
    signOut: () => Promise<void>;
    captchaVerifier: (params: captchaVerifierParam) => Promise<void>;
};

type AuthContextProviderProps = {
    children: ReactNode;
};
export const Oauth2Context = createContext<Oauth2Context | null>(null);

export function AuthContextProvider({children}: AuthContextProviderProps): JSX.Element {
    const router = useRouter();
    const [verifyResult, setVerifyResult] = useState(undefined)
    auth.languageCode = 'it';
    const signInWithGoogle = async (): Promise<void> => {
        const provider = new GoogleAuthProvider();
        await loginHandleTemplate(provider);
    };

    const signInWithFacebook = async (): Promise<void> => {
        const provider = new FacebookAuthProvider();
        await loginHandleTemplate(provider);
    };

    const loginHandleTemplate = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
        try {
            const credential = await signInWithPopup(auth, provider);
            console.log("LOGIN FACEBOOK: ")
            toast.promise(oauth2Service(await credential.user.getIdToken()), {
                pending: 'Đang đăng nhập .....',
                success: "Đăng nhập thành công!",
                error: 'Thông tin đăng nhập không hợp lệ'
            }).then((oauth2Response) => {
                handleSuccessResponse(oauth2Response, router)
            })

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const sendVerifyCode = async (phoneNumber: string, destination?: string, callback?: () => void) => {
        signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier!)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                console.log("Result: ", confirmationResult)
                setCookie("phone_number", phoneNumber)
                destination && router.push(destination)
                callback?.()
            }).catch((error) => {
            throw error;
        });
    }
    const signOut = async (): Promise<void> => {
        try {
            await signOutFirebase(auth);
        } catch (error) {
            console.log(error)
            throw error
        }
    };

    const captchaVerifier = async ({phoneNumber, destination, callBack}: captchaVerifierParam) => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'normal',
            'callback': async (response: any) => {
                console.log("CAPCHA OK!");
                console.log("Destination: " + destination)
                destination && router.prefetch(destination)
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                toast.promise(sendVerifyCode(phoneNumber, destination,callBack), {
                    pending: "Đang xác thực.... ",
                })
            },
            'expired-callback': () => {
                toast.error("CAPTCHA đã quá hạn!")
                router.refresh();
            }
        });
        window.recaptchaVerifier.render().then(function (widgetId) {
            // @ts-ignore
            grecaptcha.reset(widgetId, {'hl': 'vi'}); // Thêm tham số 'hl' với giá trị 'vi'
        });
    }

    const value: Oauth2Context = {
        signInWithGoogle,
        signOut,
        signInWithFacebook,
        captchaVerifier
    };

    return <Oauth2Context.Provider value={value}>{children}</Oauth2Context.Provider>;
}

export function useOAuth2(): Oauth2Context {
    const context = useContext(Oauth2Context);
    if (!context)
        throw new Error('useAuth must be used within an AuthContextProvider');
    return context;
}

async function handleSuccessResponse(oauth2Response: any, router: any) {
    setCookieHandler(oauth2Response.data)
    console.log("LOGIN GOOGLE SUCCESSFUL: ")
    const prevPage = getCookie("prev_page")?.toString();
    prevPage ? router.push(prevPage) : router.push("/home")
}
