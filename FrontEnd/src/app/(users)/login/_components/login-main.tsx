'use client'
import {CustomIcon} from '@components/ui/custom-icon';
import {useModal} from "@lib/hooks/useModal";
import {Modal} from 'app/(users)/_components/modal/modal';
import {DisplayModalLogin} from 'app/(users)/_components/modal/display-modal-login';
import {TERipple} from "tw-elements-react";
import {LeftSide} from './left-side';
import {useFormik} from "formik";
import LoginValidation from "@lib/validations/LoginValidation";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getCookie} from 'cookies-next';
import {setCookieHandler} from "@lib/helper/clientCookieHandle";
import {PrefetchKind} from "next/dist/client/components/router-reducer/router-reducer-types";
import {useEffect} from "react";

import {loginService} from 'services/main/auth-service';
import {useUser} from 'context/user-context';
import {useAuth} from 'context/auth-context';
import {setCookieTokenSSR} from "../../../../lib/helper/serverCookieHandle";


export function LoginMain() {
    const {open, openModal, closeModal} = useModal();
    const {signInWithFacebook, signInWithGoogle, user} = useAuth();
    const {currentUser} = useUser()
    const router = useRouter();
    const {values, touched, handleSubmit, handleChange, errors, isValid, resetForm} = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: values => {
            loginHandler(values)
        },
        validationSchema: LoginValidation,
    });
    useEffect(() => {
        console.log('access_token', getCookie("access_token"))
        console.log('user', getCookie("users"))
        console.log('currentUser', currentUser)
        router.push("login", {scroll: true})
    }, []);
    const loginHandler = (values: {}) => {
        toast.promise(loginService(values), {
            pending: 'Đang đăng nhập .....',
            success: "Đăng nhập thành công!",
            error: 'Thông tin đăng nhập không hợp lệ'
        }).then(result => {
            console.log("Login Result: ", result)
            setCookieHandler(result.data).then(value => {
                const prevPage = getCookie("prev_page")?.toString();
                console.log("prevPage: ", prevPage);
                (prevPage && prevPage !== '/login') ? router.push(prevPage) : router.push("/home")
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
        <main className="h-screen flex justify-center items-center">
            <Modal
                modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
                open={open}
                closeModal={closeModal}
            >
                <DisplayModalLogin closeModal={closeModal}/>
            </Modal>
            <div className="container h-full px-6 py-24">
                <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
                    {/* <!-- Left column container with background--> */}
                    <LeftSide/>
                    {/* <!-- Right column container with form --> */}
                    <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
                        <div className=' justify-center items-center'>
                            <CustomIcon
                                className='mt-4 h-6 w-6 text-accent-blue lg:h-12 lg:w-12 dark:lg:text-twitter-icon x'
                                iconName='GameIcon'
                            />
                        </div>
                        <h1
                            className='text-3xl before:content-["Artistry_Social_Network"] lg:leading-normal
                       lg:text-5xl lg:before:content-["Artistry_Social_Network"] text-center mb-5'
                        />

                        <form onSubmit={handleSubmit} method="post">
                            <div>
                                <label htmlFor="email" className="block text-1xl font-medium text-black">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" autoComplete="email"
                                           className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 "
                                           placeholder="Địa chỉ email hoặc số điện thoại"
                                           onChange={handleChange}
                                           value={values.email}/>
                                    {errors.email && touched.email ?
                                        <div className="text-red-700">{errors.email}</div> : null}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="mt-5 block text-1xl font-medium text-black">
                                    Mật khẩu
                                </label>
                                <div className="mt-1">
                                    <input id="password" name="password" type="password" autoComplete="current-password"
                                           className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 "
                                           placeholder="Mật khẩu"
                                           onChange={handleChange}
                                           value={values.password}/>
                                    {errors.password && touched.password ?
                                        <div className="text-red-700">{errors.password}</div> : null}
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <div className=" mt-2 mb-5">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Quên mật khẩu?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Đăng nhập
                                </button>
                            </div>

                            {/* <!-- Divider --> */}
                            <div
                                className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                                <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
                                    Hoặc
                                </p>
                            </div>

                            {/* <!-- Social login buttons --> */}

                            <TERipple rippleColor="light" className="w-full">
                                <a
                                    className="mb-3 flex w-full items-center justify-center rounded bg-info px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out hover:bg-info-600 hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-info-600 focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(84,180,211,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)]"
                                    onClick={signInWithGoogle}
                                    role="button"
                                >
                                    <CustomIcon iconName='GoogleIcon'/>
                                    <span className='pl-5'>Đăng nhập với Google</span>
                                </a>
                            </TERipple>

                            <TERipple rippleColor="light" className="w-full">
                                <a
                                    className="mb-3 flex w-full items-center justify-center rounded bg-primary px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] bg-[#3b5998]"
                                    onClick={signInWithFacebook}
                                    role="button"
                                >
                                    {/* <!-- Facebook --> */}
                                    <CustomIcon iconName='FaceBookIcon'/>
                                    <span className='pl-5'>Đăng nhập với FaceBook</span>
                                </a>
                            </TERipple>
                            <TERipple rippleColor="light" className="w-full">
                                <a
                                    className="mb-3 flex w-full items-center justify-center rounded bg-primary px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] bg-[#3b5998]"
                                    // onClick={test}
                                    role="button"
                                >
                                    {/* <!-- Facebook --> */}
                                    <CustomIcon iconName='FaceBookIcon'/>
                                    <span className='pl-5'>Đăng kí với số điện thoại</span>
                                </a>
                            </TERipple>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

// export function LoginMain1(): JSX.Element {
//   const { open, openModal, closeModal } = useModal();
//   const { signInWithFacebook, signInWithGoogle } = useAuth();
//   return (
//     <>
//       <Modal
//         modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
//         open={open}
//         closeModal={closeModal}
//       >
//         <DisplayModalLogin closeModal={closeModal} />
//       </Modal>
//       <main className='flex flex-col items-center justify-center gap-8'>
//         <div className='flex flex-col items-center justify-center gap-6 p-8 lg:justify-center'>
//           <div className='flex max-w-xs flex-row gap-4 font-twitter-chirp-extended lg:max-w-none lg:gap-16'>
//             <CustomIcon
//               className='mt-4 h-6 w-6 text-accent-blue lg:h-12 lg:w-12 dark:lg:text-twitter-icon'
//               iconName='GameIcon'
//             />
//             <h1
//               className='text-3xl before:content-["Social_Network"] lg:leading-normal
//                        lg:text-5xl lg:before:content-["Social_Network"]'
//             />
//           </div>
//           <form className="space-y-6" action="#" method="POST">
//             <div>
//               <label htmlFor="email" className="block text-1xl font-medium text-white">
//                 Email
//               </label>
//               <div className="mt-1">
//                 <input id="email" name="email" type="email" autoComplete="email" required
//                   className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Enter your email address" />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-1xl font-medium text-white">
//                 Mật khẩu
//               </label>
//               <div className="mt-1">
//                 <input id="password" name="password" type="password" autoComplete="current-password" required
//                   className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Enter your password" />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input id="remember_me" name="remember_me" type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
//                 <label htmlFor="remember_me" className="ml-2 block text-1xl text-white">
//                   Nhớ tôi
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                   Quên mật khẩu?
//                 </a>
//               </div>
//             </div>

//             <div>
//               <button type="submit"
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                 Đăng nhập
//               </button>
//             </div>
//           </form>
//           <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
//             <div className='grid gap-3 font-bold'>
//               <Button
//                 className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
//                          hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
//                          dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
//                 onClick={signInWithGoogle}
//               >
//                 <CustomIcon iconName='GoogleIcon' /> Đăng nhập với Google
//               </Button>
//               <Button
//                 className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
//                 hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
//                 dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
//                 onClick={signInWithFacebook}
//               >
//                 <CustomIcon iconName='FaceBookIcon' />Đăng nhập với Facebook
//               </Button>
//               <div className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-2'>
//                 <i className='border-b border-light-border dark:border-dark-border' />
//                 <p>or</p>
//                 <i className='border-b border-light-border dark:border-dark-border' />
//               </div>
//               <Button
//                 className='bg-accent-blue text-white transition hover:brightness-90
//                          focus-visible:!ring-accent-blue/80 focus-visible:brightness-90 active:brightness-75'
//                 onClick={() => { console.log("Redirect to Register") }}
//               >
//                 Đăng ký với số điện thoại
//               </Button>
//               {/* <p
//                 className='inner:custom-underline inner:custom-underline text-center text-xs
//                          text-light-secondary inner:text-accent-blue dark:text-dark-secondary'
//               >
//                 Bời đăng ký, bạn đồng ý với{' '}
//                 <a
//                   href='https://twitter.com/tos'
//                   target='_blank'
//                   rel='noreferrer'
//                 >
//                   Terms of Service
//                 </a>{' '}
//                 và {' '}
//                 <a
//                   href='https://twitter.com/privacy'
//                   target='_blank'
//                   rel='noreferrer'
//                 >
//                   Privacy Policy
//                 </a>
//                 , bao gồm{' '}
//                 <a
//                   href='https://help.twitter.com/rules-and-policies/twitter-cookies'
//                   target='_blank'
//                   rel='noreferrer'
//                 >
//                   Cookie Use
//                 </a>
//                 .
//               </p> */}
//             </div>
//             <div className='flex flex-col gap-3'>
//               <p className='font-bold text-center'>Bạn đã có tài khoản? </p>
//               <Button
//                 className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
//                          focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
//                          dark:border-light-secondary'
//                 onClick={openModal}
//               >
//                 Sign in
//               </Button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }


