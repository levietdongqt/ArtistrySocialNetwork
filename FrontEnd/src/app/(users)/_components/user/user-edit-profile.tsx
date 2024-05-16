'use client'
import React, {useState, useEffect, useRef} from 'react';
import { toast } from 'react-toastify';
import cn from 'clsx';
import { useUser } from '../../../../context/user-context';
import type { FilesWithId } from '@models/file';
import {User, EditableData, EditableUserData, EditableProviderData} from '@models/user';
import useSWR from "swr";
import {getUserById, updateUser} from "../../../../services/main/clientRequest/userClient";
import {useParams, useRouter} from "next/navigation";
import {useFormik} from "formik";
import RegisterProviderValidation from "@lib/validations/RegisterProviderValidation";
import {DatePicker, Radio, RadioChangeEvent, Select, Tooltip} from "antd";
import InputAddress from "../input/input-address";
import DescriptionInput from "../input/input-description";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import moment from 'moment';
import {UserRole} from "@lib/enum/UserRole";
import {checkPhoneFormat} from "../../../(auth)/_components/phone-validate";
import {isExistAccount} from "../../../../services/main/auth-service";
import EditUserValidation from "@lib/validations/EditUserValidation";
import UploadProfileImage from "../../(main-layout)/profile/edit/upload-avatar-cover";
import {useUpload} from "../../../../context/uploadfile-context";
import {uploadImages} from "../../../../firebase/utils";
import {AxiosError} from "axios";
import {Modal} from "../modal/modal";
import {VerifyCode} from "../../../(auth)/verify/verify-code";
import {setCookie} from "cookies-next";
import {refresh_token_options} from "@lib/config/TokenConfig";
import {useOAuth2} from "../../../../context/oauth2-context";
import {differenceInMonths} from "date-fns";
import {deleteCookieTokenSSR} from "@lib/helper/serverCookieHandle";

interface FormValues {
  coverImage: string | null;
  avatar: string | null;
  fullName: string;
}
type UserEditProfileProps = {
  closeModal: () => void;
};

export function UserEditProfile(): JSX.Element {
  const {captchaVerifier} = useOAuth2()
  const {currentUser, setCurrentUser} = useUser();
  const { ID } = useParams();
  const {data: response,isLoading:loading} = useSWR(getUserById(currentUser!.id ), fetcherWithToken);
  const coverInputFileRef = useRef<HTMLInputElement>(null);
  const profileInputFileRef = useRef<HTMLInputElement>(null);
  const [isShowCaptcha, setIsShowCaptcha] = useState(true)
  const {files} = useUpload();
  const [newUpdateData, setNewUpdateData] = useState({})
  const {prefetch,push,back} = useRouter()
  const router = useRouter()
  const [openVerifyAccount, setOpenVerifyAccount] = useState(false);
  const [openVerifyCode, setOpenVerifyCode] = useState(false);
  const [errorExistAccount, setErrorExistAccount] = useState(false)
  const [showValidPhone, setShowValidPhone] = useState(false)
  const [finalPhone, setFinalPhone] = useState("")
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddRoles, setIsAddRoles] = useState(false)
  const {signOut} = useOAuth2()
  /*const { name, username, verified, photoURL } = user as User;*/
  const handleSignOut = async () => {
    // router.prefetch("/login")
    console.log("SIGN OUT")
    await deleteCookieTokenSSR();
    await signOut();
    push("/login");
  }
  const [editUserData, setEditUserData] = useState<EditableUserData>({
    id: currentUser!.id,
    bio:response?.data.bio,
    fullName:response?.data.fullName,
    avatar:response?.data.avatar,
    location:response?.data.location,
    coverImage:response?.data.coverImage,
    phoneNumber:response?.data.phoneNumber?   "0".concat(response?.data.phoneNumber .substring(3)) : "",
    address:response?.data.address,
    dateOfBirth:response?.data.dateOfBirth,
    email:response?.data.email,
    roles:response?.data.roles,
    gender:response?.data.gender,
    updateAt:response?.data.updateAt
  });
  const resetUserEditData = (): void =>
      setEditUserData({
        id: currentUser!.id,
        bio:response?.data.bio,
        fullName:response?.data.fullName,
        avatar:response?.data.avatar,
        location:response?.data.location,
        coverImage:response?.data.coverImage,
        phoneNumber:response?.data.phoneNumber,
        address:response?.data.address,
        dateOfBirth:response?.data.dateOfBirth ,
        email:response?.data.email,
        roles:response?.data.roles,
        gender:response?.data.gender,
        updateAt:response?.data.updateAt
      });
  const [addressn, setAddressn] = useState(editUserData.address);
  const [errorLocation, setErrorLocation] = useState('');
  const [newbio, setNewBio] = useState(editUserData.bio);
  const updateAtDate = new Date(editUserData.updateAt);
  const canUpdateFullName = differenceInMonths(Date.now(), updateAtDate) >= 6;

  const roleOptions = [
    {label: 'Studio', value: UserRole.ROLE_STUDIO},
    {label: 'Photo', value: UserRole.ROLE_PHOTO},
    {label: 'Makeup', value: UserRole.ROLE_MAKEUP},
    {label: 'Model', value: UserRole.ROLE_MODEL},
  ];

  // Định nghĩa hàm tải lên và xử lý ảnh
  async function uploadAndClassifyImages(userId: string, files: FilesWithId) {
    const uploadedImagesData = await uploadImages(userId, files);

    let avatarUrl: string | undefined;
    let coverImageUrl: string | undefined;

    if (uploadedImagesData) {
      // Tìm ảnh avatar
      const avatarImage = uploadedImagesData.find((upload: any) => upload.alt.startsWith('avatar'));
      if (avatarImage) {
        avatarUrl = avatarImage.src;
        console.log('avatarUrl', avatarUrl);
      }

      // Tìm ảnh cover
      const coverImage = uploadedImagesData.find((upload: any) => upload.alt.startsWith('coverimage'));
      if (coverImage) {
        coverImageUrl = coverImage.src;
        console.log('coverImageUrl', coverImageUrl);
      }
    }

    return { avatarUrl, coverImageUrl };
  }
  function toLocalDateTimeFormat(date:any) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
// Sử dụng hàm mới trong onSubmit
  const { values, touched, handleSubmit, handleChange, errors, setValues } = useFormik({
    initialValues: editUserData,
    validationSchema: EditUserValidation,
    onSubmit: async (values: EditableUserData, {}) => {
      let updateDateName;
      if (values.fullName !== response?.data.fullName) {
        updateDateName = toLocalDateTimeFormat(new Date()).replace(' ', 'T');
      }
        const phoneNumberFinal = checkPhoneFormat(values.phoneNumber!)!;
        const { avatarUrl, coverImageUrl } = await uploadAndClassifyImages(currentUser?.id as string, files as FilesWithId);
        console.log("Upload",avatarUrl,coverImageUrl);
        const editData = {
          ...values,
          bio: newbio,
          phoneNumber: phoneNumberFinal,
          address: addressn,
          avatar: avatarUrl === undefined ? response?.data.avatar : avatarUrl,
          coverImage: coverImageUrl === undefined ? response?.data.coverImage : coverImageUrl,
          updateAt :updateDateName,
        };
      setNewUpdateData(editData)

      if (phoneNumberFinal !== currentUser?.phoneNumber) {
        console.log(phoneNumberFinal,'vả',response?.phoneNumber)
        await captchaVerifier({
          phoneNumber: phoneNumberFinal,
          callBack: () => {
            console.log("Register provider callback")
            setOpenVerifyCode(true)
            setIsShowCaptcha(false)
          },
        })
      }else {
        if (!isAddRoles) {
          toast.promise(
              updateProfile(editData),
              {
                pending: 'Đang cập nhật thông tin...',
                success: 'Cập nhật thông tin thành công',
                error: 'Cập nhật thông tin thất bại!'
              }
          ).then(() => {
            back();
          });
        }else {
          updateProfile(editData)
          toast.success('Vui lòng đăng nhập lại để cập nhật thông tin nhà cung cấp');
          handleSignOut()
        }

      }

    },
  });
  const updateProfile = async (provider: any) => {
    try {
      const response = await updateUser(provider);
      const updatedUser = response.data as User;
      console.log('updatedUser', updatedUser);
      setCurrentUser(updatedUser);
      setCookie('user', JSON.stringify(updatedUser), refresh_token_options);
      // back();
    } catch (error) {
      console.error("Failed to Provider Register", error);
    }
  };



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
            setErrorLocation('');
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

  const handleDescriptionChange = (content: string) => {
    setNewBio(content);
  };

  const handleDateChange = (date:any, dateString:any) => {
    // Cập nhật trạng thái mới với giá trị đã định dạng
    setValues(prevValues => ({
      ...prevValues,
      dateOfBirth: dateString, // dateString được DatePicker của Ant Design định dạng sẵn
    }));
  };

  const handleRoleChange = (roleValues: any) => {
    const updatedRoles = Array.isArray(roleValues) ? roleValues : [roleValues];
    const hasAdditionalRoles = updatedRoles.some(role => role !== UserRole.ROLE_USER);
    if (hasAdditionalRoles && !updatedRoles.includes(UserRole.ROLE_PROVIDER)) {
      updatedRoles.push(UserRole.ROLE_PROVIDER, UserRole.ROLE_USER);
      const uniqueRoles = Array.from(new Set(updatedRoles));
      setIsAddRoles(true)
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


  const handleGenderChange = (e: RadioChangeEvent) => {
    const newValues = { ...values, gender: e.target.value };
    setValues(newValues);
  };

  const verifyCodeCallBack = async (provider: any) => {
    setOpenVerifyCode(false)
    console.log("Verifying Code callBack: ", provider)
    await updateProfile(provider)
  }


  return (
      <>
        <Modal
            modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
            open={openVerifyCode} closeModal={() => setOpenVerifyCode(false)}>
          <VerifyCode callback={() => verifyCodeCallBack(newUpdateData)}/>
        </Modal>
      <form onSubmit={handleSubmit} className={cn( 'w-full h-full mx-auto p-6 bg-white rounded shadow')}>

        <section
            className={cn(
                'h-full overflow-y-auto transition-opacity',
                loading && 'pointer-events-none opacity-50'
            )}
        >

          <UploadProfileImage/>

          <div className="mb-4 flex flex-col sm:flex-row">
            <div className="mr-2 flex-grow mb-2 sm:mb-0">
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Họ và Tên
              </label>
              {canUpdateFullName ? (
                  <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                      onChange={handleChange}
                      value={values.fullName || ''}
                  />
              ) : (
                  <Tooltip title="Họ tên chỉ được phép đổi 6 tháng một lần">
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                        onChange={handleChange}
                        value={values.fullName || ''}
                        disabled={!canUpdateFullName} // Khóa input nếu chưa đủ 6 tháng
                    />
                  </Tooltip>
              )}
              {errors.fullName && touched.fullName ? (
                  <div className="text-red-700 text-sm">{errors.fullName}</div>
              ) : null}
            </div>

            <div className="mr-2 flex-grow mb-2 sm:mb-0">
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              {currentUser?.authProvider === 'google.com' ? (
                  <Tooltip title="Vì bạn đăng nhập bằng tài khoản Google nên bạn không thể thay đổi email">
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        onChange={handleChange}
                        value={values.email || ''}
                        disabled// Thêm dòng này để disable input nếu phoneNumber đã có giá trị
                    />
                  </Tooltip>
              ) : (
                  <input
                      type="text"
                      id="email"
                      name="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                      onChange={handleChange}
                      value={values.email || ''}
                  />
              )}


              {errors.email && touched.email ?
                  <div className="text-red-700 text-sm">{errors.email}</div> : null}
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row">


            <div className="mr-2 flex-grow mb-2 sm:mb-0">
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Số điện thoại</label>
              <div className="flex items-center mt-2">
                <div id="dropdown-phone-button" data-dropdown-toggle="dropdown-phone"
                     className="flex-shrink-0 z-10 inline-flex items-center py-2 px-3 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-md hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-500"
                >
                  +84
                </div>
                <input type="text" id="phoneNumber"
                       className="appearance-none border rounded-r-md w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                       placeholder="398713843"
                       value={values.phoneNumber || ''}
                       onChange={handleChange}
                       onBlur={event => checkExistAccount(event.target.value)}
                       required
                />
              </div>
              {
                  errorExistAccount && values.phoneNumber !== editUserData.phoneNumber && (
                      <div className="text-red-700 text-sm">Số điện thoại đã được đăng kí</div>
                  )
              }
              {
                  showValidPhone &&
                  <div className="text-blue-700 text-sm ">Bạn có thể đăng kí với số điện thoại này</div>
              }
              {errors.phoneNumber && touched.phoneNumber ?
                  <div className="text-red-700 text-sm ">{errors.phoneNumber}</div> : null}
            </div>

            <div className="mr-2 flex-grow mb-2 sm:mb-0">
              <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                Giới tính:
              </label>

              <Radio.Group id="gender" onChange={handleGenderChange} value={values.gender} name="gender">
                <Radio value={true} className="mb-2">Nam</Radio>
                <Radio value={false} className="mb-2">Nữ</Radio>
              </Radio.Group>

              {errors.gender && touched.gender ? (
                  <div className="text-red-700 text-sm">{errors.gender}</div>
              ) : null}
            </div>

          </div>

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
                  value={values.roles && values.roles.filter(value => {
                    return (value !== UserRole.ROLE_PROVIDER && value !== UserRole.ROLE_USER && value !== UserRole.ROLE_ADMIN)
                  })}
                  options={roleOptions}
                  className="w-full"
              />
              {errors.roles && touched.roles ?
                  <div className="text-red-700 text-sm">{errors.roles}</div> : null}

            </div>

            <div className="mr-2 flex-grow mb-2 sm:mb-0">
              <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm font-bold mb-2">Ngày Sinh</label>
              <DatePicker
                  id="dateOfBirth"
                  format="YYYY-MM-DD"
                  onChange={handleDateChange}
                  value={values.dateOfBirth ? moment(values.dateOfBirth) : null}
                  required
              />
              {errors.dateOfBirth && touched.dateOfBirth ? (
                  <div className="text-red-700 text-sm">{errors.dateOfBirth}</div>
              ) : null}
            </div>

          </div>


          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            {values.address && !isEditingAddress && (
                <div className="flex justify-between items-center">
                  <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                    Địa chỉ hiện tại: <span>{values.address}</span>
                  </label>
                  {/* Nút để kích hoạt chế độ chỉnh sửa địa chỉ */}
                  <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Sửa
                  </button>
                </div>
            )}
            {/* Hiển thị InputAddress nếu không có giá trị địa chỉ hoặc đang trong chế độ chỉnh sửa */}
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
        </section>

        <div className="flex items-center justify-between">
          <button type="submit"
                  disabled={errorLocation !== null && errorLocation !== ''}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            cập nhật thông tin
          </button>
        </div>
      </form>
      </>
  );
}
