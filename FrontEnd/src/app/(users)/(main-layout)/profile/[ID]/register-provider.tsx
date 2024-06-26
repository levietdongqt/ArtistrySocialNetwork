'use client'
import React, {useEffect, useState} from 'react';
import {useUser} from "../../../../../context/user-context";
import {useFormik} from 'formik';
import ReactQuill from 'react-quill'; // Thêm dòng này để import ReactQuill
// import 'react-quill/dist/quill.snow.css';
import {EditableProviderData, User} from "@models/user";
import {UserRole} from "@lib/enum/UserRole";
import {getUserById, updateUser} from "../../../../../services/main/clientRequest/userClient";
import {Select} from "antd";
import RegisterProviderValidation from "@lib/validations/RegisterProviderValidation";
import InputAddress from "../../../_components/input/input-address";
import DescriptionInput from "../../../_components/input/input-description";
import useSWR from "swr";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {toast} from "react-toastify";
import {Modal} from "../../../_components/modal/modal";
import {VerifyAccount} from "../../../../(auth)/verify/verify-account";
import {VerifyCode} from "../../../../(auth)/verify/verify-code";
import Link from "next/link";
import {EditOutlined} from "@ant-design/icons";
import {checkPhoneFormat} from "../../../../(auth)/_components/phone-validate";
import {isExistAccount} from "../../../../../services/main/auth-service";
import {useOAuth2} from "../../../../../context/oauth2-context";
import {setCookie} from "cookies-next";
import {useRouter} from "next/navigation";
import {refresh_token_options} from "@lib/config/TokenConfig";
import {deleteCookieTokenSSR} from "@lib/helper/serverCookieHandle";

type RegisterProviderFormProps = {
    closeModal: () => void;
};

const RegisterProviderForm: React.FC<RegisterProviderFormProps> = ({closeModal}) => {
    const {captchaVerifier} = useOAuth2()
    const {prefetch,push} = useRouter()
    const {currentUser, setCurrentUser} = useUser();
    const [isClient, setIsClient] = useState(false);
    console.log('currentUser', currentUser);
    const [user, setUser] = useState<EditableProviderData>({
        id: currentUser!.id,
        bio: currentUser?.bio ?? "",
        phoneNumber: currentUser?.phoneNumber ? "0".concat(currentUser.phoneNumber.substring(3)) : "",
        roles: currentUser?.roles ?? [],
        location: currentUser?.location ?? {},
        address: currentUser?.address ?? ""
    });
    const {signOut} = useOAuth2()
    /*const { name, username, verified, photoURL } = user as User;*/
    const handleSignOut = async () => {
        // router.prefetch("/login")
        console.log("SIGN OUT")
        await deleteCookieTokenSSR();
        await signOut();
        push("/login");
    }
    const [newbio, setNewBio] = useState(user.bio)
    const roleOptions = [
        {label: 'Studio', value: UserRole.ROLE_STUDIO},
        {label: 'Photo', value: UserRole.ROLE_PHOTO},
        {label: 'Makeup', value: UserRole.ROLE_MAKEUP},
        {label: 'Model', value: UserRole.ROLE_MODEL},
    ];
    const [addressn, setAddressn] = useState(user.address);
    const [errorLocation, setErrorLocation] = useState('');
    const [isShowCaptcha, setIsShowCaptcha] = useState(true)
    const [openVerifyCode, setOpenVerifyCode] = useState(false);
    const [errorExistAccount, setErrorExistAccount] = useState(false)
    const [showValidPhone, setShowValidPhone] = useState(false)
    const [newProviderData, setNewProviderData] = useState({})
    const [finalPhone, setFinalPhone] = useState("")
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const {values, touched, handleSubmit, handleChange, errors, setValues} = useFormik({
        initialValues: user,
        validationSchema: RegisterProviderValidation,
        onSubmit: async (values: EditableProviderData, {}) => {
            const phoneNumberFinal = checkPhoneFormat(values.phoneNumber!)!;

            const providerData = {
                ...values,
                phoneNumber: phoneNumberFinal,
                bio: newbio,
                address: addressn
            };

            console.log('new ProviderData:', providerData);
            setNewProviderData(providerData)

            if (phoneNumberFinal !== currentUser?.phoneNumber) {
                await captchaVerifier({
                    phoneNumber: phoneNumberFinal,
                    callBack: () => {
                        console.log("Register provider callback")
                        setOpenVerifyCode(true)
                        setIsShowCaptcha(false)
                    },
                })
            } else {
                await registerProvider(providerData);
            }


        },
    });

    const registerProvider = async (provider: any) => {
        try {
            const response = await updateUser(provider);
            toast.success('Đăng ký nhà cung cấp thành công. Vui lòng đăng nhập lại');
            console.log("Provider Register successfully", response);
            const updatedUser = response.data as User;
            setCurrentUser(updatedUser)

            setCookie('user', JSON.stringify(updatedUser),refresh_token_options);

            handleSignOut();
            closeModal();
        } catch (error) {
            console.error("Failed to Provider Register", error);
        }
    }

    const verifyCodeCallBack = async (provider: any) => {
        setOpenVerifyCode(false)
        console.log("Verifying Code callBack: ", provider)
        await registerProvider(provider)
    }

    let timeoutId: any;
    const handleAddressComplete = async (compAddress: any) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            callBack(compAddress)


        }, 600)

        const callBack = async (compAddress: any) => {
            console.log('compAddress', compAddress);
            if (compAddress !== null || compAddress !== '') {
                setAddressn(compAddress);
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(compAddress)}`);
                    const data = await response.json();

                    if (data && data.length > 0) {
                        const locationMap: any = {
                            latitude: data[0].lat,
                            longitude: data[0].lon
                        }
                        setValues((prevValues) => ({...prevValues, location: locationMap}));
                        setValues(prevValues => ({ ...prevValues, address:compAddress }));
                        setErrorLocation('');
                        console.log('vị trí:', locationMap);
                    } else {
                        setErrorLocation('Không tìm thấy vị trí của địa chỉ. Vui lòng nhập lại.');
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy vị trí từ địa chỉ:', error);
                    setErrorLocation('Lỗi khi lấy vị trí từ địa chỉ. Vui lòng thử lại sau.');
                }
            }
        }
    };


    const handleRoleChange = (roleValues: any) => {
        const updatedRoles = Array.isArray(roleValues) ? roleValues : [roleValues];
        const hasAdditionalRoles = updatedRoles.some(role => role !== UserRole.ROLE_USER);
        if (hasAdditionalRoles && !updatedRoles.includes(UserRole.ROLE_PROVIDER)) {
            updatedRoles.push(UserRole.ROLE_PROVIDER, UserRole.ROLE_USER);
            const uniqueRoles = Array.from(new Set(updatedRoles));
            setValues(prevValues => ({
                ...prevValues,
                roles: uniqueRoles,
            }));
        } else {
            const filteredRoles = updatedRoles.filter(role => role !== UserRole.ROLE_PROVIDER);
            setValues(prevValues => ({
                ...prevValues,
                roles: filteredRoles,
            }));
        }

        console.log('Updated roles: ', updatedRoles);
    };

    const handleDescriptionChange = (content: string) => {
        setNewBio(content);
    };
    useEffect(() => {
        console.log("openVerifyCode chaange: ", openVerifyCode)
    }, [openVerifyCode]);

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

            <Modal
                modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
                open={openVerifyCode} closeModal={() => setOpenVerifyCode(false)}>
                <VerifyCode callback={() => verifyCodeCallBack(newProviderData)}/>
            </Modal>

            <form onSubmit={handleSubmit} className="w-full h-full mx-auto p-6 bg-white rounded shadow">

                <div className="mb-4 flex flex-col sm:flex-row">
                    <div className="mr-2 flex-grow mb-2 sm:mb-0">
                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                            Bạn là: </label>
                        <Select
                            mode="multiple"
                            showSearch
                            id="role-select"
                            placeholder="Chọn vai trò của bạn"
                            optionFilterProp="children"
                            onChange={handleRoleChange} // Sử dụng setFieldValue thông qua handleRoleChange
                            filterOption={(input, option) =>
                                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
                            }
                            value={values.roles.filter(value => {
                                return (value !== UserRole.ROLE_PROVIDER && value !== UserRole.ROLE_USER)
                            })} // Giả sử 'roles' là một mảng và chúng ta lấy giá trị đầu tiên
                            options={roleOptions}
                            className="w-full"
                        />
                        {errors.roles && touched.roles ?
                            <div className="text-red-700 text-sm">{errors.roles}</div> : null}

                    </div>


                    <div className="mr-2 flex-grow mb-2 sm:mb-0">
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
                                       value={values.phoneNumber || ''}
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

                </div>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    {values.address && !isEditingAddress && (
                        <div className="flex justify-between items-center">
                            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                                Địa chỉ hiện tại: <span>{values.address}</span>
                            </label>
                            <button
                                onClick={() => setIsEditingAddress(true)}
                                className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Sửa
                            </button>
                        </div>
                    )}
                    {(isEditingAddress || !values.address) && (
                        <>
                            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                                Địa chỉ hiện tại: <span>{values.address}</span>
                            </label>
                            <InputAddress onAddressComplete={(address) => {
                                handleAddressComplete(address);
                            }}/>
                            <button
                                onClick={() => setIsEditingAddress(false)}
                                className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Hủy
                            </button>
                            {errorLocation && <div className="text-red-700 text-sm">{errorLocation}</div>}
                            {errors.address && touched.address ?
                                <div className="text-red-700 text-sm ">{errors.address}</div> : null}
                        </>
                    )}
                </div>

                <div className="mb-4 ">
                    <label htmlFor="serviceDescription" className="block text-gray-700 text-sm font-bold mb-2">
                        Giới thiệu về bạn
                    </label>
                    <DescriptionInput
                        value={newbio || ''}
                        onChange={handleDescriptionChange}
                    />

                </div>

                {
                    isShowCaptcha && <div className="mx-auto">
                        <div id="recaptcha-container" className="my-5"></div>
                    </div>
                }

                <div className="flex items-center justify-between">
                    <button type="submit"
                            disabled={errorLocation !== null && errorLocation !== ''}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Đăng ký làm nhà cung cấp
                    </button>
                </div>

            </form>
        </>
    );
};

export default RegisterProviderForm;