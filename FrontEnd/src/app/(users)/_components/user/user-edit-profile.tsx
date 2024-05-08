'use client'
import React, {useState, useEffect, useRef} from 'react';
import { toast } from 'react-toastify';
import cn from 'clsx';
import { useUser } from '../../../../context/user-context';
import { useModal } from '@lib/hooks/useModal';
import { getImagesData } from '@lib/validation';
import { Button } from '@components/ui/button';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { FilesWithId } from '@models/file';
import {User, EditableData, EditableUserData, EditableProviderData} from '@models/user';
import type { InputFieldProps } from '../input/input-field';
import useSWR from "swr";
import {getUserById, updateUser} from "../../../../services/main/clientRequest/userClient";
import {useParams} from "next/navigation";
import {useFormik} from "formik";
import RegisterProviderValidation from "@lib/validations/RegisterProviderValidation";
import {DatePicker, Radio, RadioChangeEvent, Select} from "antd";
import InputAddress from "../input/input-address";
import DescriptionInput from "../input/input-description";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {NextImage} from "@components/ui/next-image";
import {HeroIcon} from "@components/ui/hero-icon";
import {ToolTip} from "@components/ui/tooltip";
import moment from 'moment';
import {UserRole} from "@lib/enum/UserRole";
import {checkPhoneFormat} from "../../../(auth)/_components/phone-validate";
import {isExistAccount} from "../../../../services/main/auth-service";
import EditUserValidation from "@lib/validations/EditUserValidation";
import dayjs from "dayjs";
import UploadProfileImage from "../../(main-layout)/profile/edit/upload-avatar-cover";
import {useUpload} from "../../../../context/uploadfile-context";
import {uploadImages} from "../../../../firebase/utils";
import {AxiosError} from "axios";
interface FormValues {
  coverImage: string | null;
  avatar: string | null;
  fullName: string;
}
type UserEditProfileProps = {
  hide?: boolean;
};

export function UserEditProfile({ hide }: UserEditProfileProps): JSX.Element {
  const { currentUser } = useUser();
  const { open, openModal, closeModal } = useModal();
  const { ID } = useParams();
  const {data: response,isLoading:loading} = useSWR(getUserById(currentUser!.id ), fetcherWithToken);
  const coverInputFileRef = useRef<HTMLInputElement>(null);
  const profileInputFileRef = useRef<HTMLInputElement>(null);
  const {files} = useUpload();

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
      });
  const [addressn, setAddressn] = useState(editUserData.address);
  const [errorLocation, setErrorLocation] = useState('');
  const [newbio, setNewBio] = useState(editUserData.bio);
  const [openVerifyAccount, setOpenVerifyAccount] = useState(false);
  const [openVerifyCode, setOpenVerifyCode] = useState(false);
  const [errorExistAccount, setErrorExistAccount] = useState(false)
  const [showValidPhone, setShowValidPhone] = useState(false)
  const [finalPhone, setFinalPhone] = useState("")

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

// Sử dụng hàm mới trong onSubmit
  const { values, touched, handleSubmit, handleChange, errors, setValues } = useFormik({
    initialValues: editUserData,
    validationSchema: EditUserValidation,
    onSubmit: async (values: EditableUserData, {}) => {
      try {
        // Gọi hàm và lấy kết quả
        const { avatarUrl, coverImageUrl } = await uploadAndClassifyImages(currentUser?.id as string, files as FilesWithId);

        const editData = {
          ...values,
          bio: newbio,  // Lưu ý: đảm bảo `newbio` và `addressn` đã được định nghĩa
          address: addressn,
          avatar: avatarUrl,
          coverImage: coverImageUrl
        };

        // Gọi API để cập nhật thông tin
        const response = await updateUser(editData);
        toast.success('Cập nhật thông tin thành công');
        console.log("Cập nhật thành công", response);
        closeModal();
      } catch (error: unknown) {
        if (error instanceof Error && 'response' in error) {
          // Nếu bạn biết lỗi là đối tượng nào đó, hãy ép kiểu để tránh lỗi TS18046
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.error("Error response from server:", axiosError.response);
            // Bạn có thể truy xuất chi tiết lỗi từ axiosError.response.data
          }
        } else {
          console.error("Lỗi không xác định khi cập nhật thông tin");
          toast.error('Cập nhật thông tin thất bại do lỗi không xác định');
        }
      }
    },
  });

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

  return (
      <form onSubmit={handleSubmit} className={cn(hide && 'w-full h-full mx-auto p-6 bg-white rounded shadow')}>

        <section
            className={cn(
                'h-full overflow-y-auto transition-opacity',
                loading && 'pointer-events-none opacity-50'
            )}
        >

          <UploadProfileImage/>

          <div className="mb-4 flex flex-col sm:flex-row">
            <div className="mr-2 flex-grow mb-2 sm:mb-0">
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Họ & Tên</label>
              <input type="text" id="fullName" name="fullName"
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                     required onChange={handleChange} value={values.fullName || ''}/>
              {errors.fullName && touched.fullName ?
                  <div className="text-red-700 text-sm">{errors.fullName}</div> : null}
            </div>

            <div className="mr-2 flex-grow mb-2 sm:mb-0">
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                  type="text"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  onChange={handleChange}
                  value={values.email || ''}
                  disabled={currentUser?.authProvider === 'google.com'} // Thêm dòng này để disable input nếu phoneNumber đã có giá trị
              />
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
            {values.address && (
                <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                  Địa chỉ hiện tại:
                  <span>{values.address}</span>
                </label>
            )}
            <InputAddress onAddressComplete={handleAddressComplete}/>
            {errorLocation &&
                <div className="text-red-700 text-sm">{errorLocation}</div>}
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
        </section>
        {/*<div className="mx-auto">*/}
        {/*  <div id="recaptcha-container" className="my-5"></div>*/}
        {/*</div>*/}
        <div className="flex items-center justify-between">
          <button type="submit"
                  disabled={errorLocation !== null && errorLocation !== ''}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Đăng ký làm nhà cung cấp
          </button>
        </div>
      </form>
  );
}
