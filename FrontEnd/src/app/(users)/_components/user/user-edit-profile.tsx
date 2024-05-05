'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import cn from 'clsx';
import { useUser } from '../../../../context/user-context';
import { useModal } from '@lib/hooks/useModal';
import { uploadImages } from '../../../../firebase/utils';
import { sleep } from '@lib/utils';
import { getImagesData } from '@lib/validation';
import { Modal } from '../modal/modal';
import { EditProfileModal } from '../modal/edit-profile-modal';
import { Button } from '@components/ui/button';
import { InputField } from '../input/input-field';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { FilesWithId } from '@models/file';
import {User, EditableData, EditableUserData, EditableProviderData} from '@models/user';
import type { InputFieldProps } from '../input/input-field';
import useSWR from "swr";
import {getUserById, updateUser} from "../../../../services/main/clientRequest/userClient";
import {useParams} from "next/navigation";
import {useFormik} from "formik";
import RegisterProviderValidation from "@lib/validations/RegisterProviderValidation";
import {Select} from "antd";
import {UserRole} from "@lib/enum/UserRole";
import InputAddress from "../input/input-address";
import DescriptionInput from "../input/input-description";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";

type RequiredInputFieldProps = Omit<InputFieldProps, 'handleChange'> & {
  inputId: EditableData;
};

type UserImages = Record<
  Extract<EditableData, 'avatar' | 'coverImage'>,
  FilesWithId
>;

type TrimmedTexts = Pick<
  EditableUserData,
  Exclude<EditableData, 'photoURL' | 'coverPhotoURL'>
>;

type UserEditProfileProps = {
  hide?: boolean;
};

export function UserEditProfile({ hide }: UserEditProfileProps): JSX.Element {
  const { currentUser } = useUser();
  const { open, openModal, closeModal } = useModal();
  const { ID } = useParams();
  const {data: response,isLoading:loading} = useSWR(getUserById(currentUser!.id ), fetcherWithToken);

  const [editUserData, setEditUserData] = useState<EditableUserData>({
    bio:response?.data.bio,
    fullName:response?.data.fullName,
    avatar:response?.data.avatar,
    location:response?.data.location,
    coverImage:response?.data.coverImage,
    phoneNumber:response?.data.phoneNumber,
    address:response?.data.address,
    dateOfBirth:response?.data.dateOfBirth,
    email:response?.data.email
  });
  console.log('editUserData',editUserData.fullName)
  const resetUserEditData = (): void =>
      setEditUserData({
        bio:response?.data.bio,
        fullName:response?.data.fullName,
        avatar:response?.data.avatar,
        location:response?.data.location,
        coverImage:response?.data.coverImage,
        phoneNumber:response?.data.phoneNumber,
        address:response?.data.address,
        dateOfBirth:response?.data.dateOfBirth,
        email:response?.data.email
      });
  const [addressn, setAddressn] = useState(editUserData.address);
  const [errorLocation, setErrorLocation] = useState('');
  const [newbio, setNewBio] = useState(editUserData.bio)
  const [userImages, setUserImages] = useState<UserImages>({
    avatar: [],
    coverImage: []
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanImage, []);

  const inputNameError = !editUserData.fullName?.trim()
    ? "Name can't be blank"
    : '';

  // const updateData = async (): Promise<void> => {
  //
  //   const userId = currentUser?.id as string;
  //
  //   const { avatar, coverImage: coverURL } = userImages;
  //
  //   const [newPhotoURL, newCoverPhotoURL] = await Promise.all(
  //     [avatar, coverURL].map((image) => uploadImages(userId, image))
  //   );
  //
  //   const newImages: Partial<Pick<User, 'avatar' | 'coverImage'>> = {
  //     coverImage:
  //         coverImage === editUserData.coverImage
  //         ? coverImage
  //         : newCoverPhotoURL?.[0].src ?? null,
  //     ...(newPhotoURL && { photoURL: newPhotoURL[0].src })
  //   };
  //
  //   const trimmedKeys: Readonly<EditableData[]> = [
  //     'fullName',
  //     'bio',
  //     // 'location',
  //     // 'website'
  //   ];
  //
  //   const trimmedTexts = trimmedKeys.reduce(
  //     (acc, curr) => ({ ...acc, [curr]: editUserData[curr] ?? null }),
  //     {} as TrimmedTexts
  //   );
  //
  //
  //   const newUserData: Readonly<EditableUserData> = {
  //     ...editUserData,
  //     ...trimmedTexts,
  //     ...newImages
  //   };
  //
  //   await sleep(500);
  //
  //   /*await updateUserData(userId, newUserData);*/
  //
  //   closeModal();
  //
  //   cleanImage();
  //
  //   setEditUserData(newUserData);
  //
  //   toast.success('Profile updated successfully');
  // };

  const {values, touched, handleSubmit, handleChange, errors,setValues } = useFormik({
    initialValues: editUserData,
    validationSchema: RegisterProviderValidation,
    onSubmit: async (values: EditableUserData, {}) => {

      const editData = {

        ...values,
        bio: newbio,
        address: addressn
      };
      console.log('vị trí adasd:', editData.location);
      try {
        const response = await updateUser(editData);
        toast.success('Đăng ký nhà phân phối thành công');
        console.log("Provider Register successfully",response);
        closeModal();
      } catch (error) {

        console.error("Failed to Provider Register", error);
      }
    },
  });

  const handleAddressComplete = async (compAddress: any) => {
    if (compAddress !== null || compAddress !== '') {
      setAddressn(compAddress);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(compAddress)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          // Sử dụng Map<string, object> như mong đợi
          const locationMap = new Map<string, any>([
            ['latitude', data[0].lat],
            ['longitude', data[0].lon]
          ]);
          setValues((prevValues) => ({...prevValues, location: locationMap}));
          setErrorLocation('');
          console.log('vị trí:', locationMap);
        }else {
          setErrorLocation('Không tìm thấy vị trí của địa chỉ. Vui lòng nhập lại.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy vị trí từ địa chỉ:', error);
        setErrorLocation('Lỗi khi lấy vị trí từ địa chỉ. Vui lòng thử lại sau.');
      }
    }

  };

  const handleDescriptionChange = (content: string) => {
    setNewBio(content);
  };


  const editImage =
    (type: 'cover' | 'profile') =>
    ({ target: { files } }: ChangeEvent<HTMLInputElement>): void => {
      const imagesData = getImagesData(files);

      if (!imagesData) {
        toast.error('Please choose a valid GIF or Photo');
        return;
      }

      const { imagesPreviewData, selectedImagesData } = imagesData;

      const targetKey = type === 'cover' ? 'coverPhotoURL' : 'photoURL';
      const newImage = imagesPreviewData[0].src;

      setEditUserData({
        ...editUserData,
        [targetKey]: newImage
      });

      setUserImages({
        ...userImages,
        [targetKey]: selectedImagesData
      });
    };

  const removeCoverImage = (): void => {
    setEditUserData({
      ...editUserData,
      coverImage: null
    });

    setUserImages({
      ...userImages,
      coverImage: []
    });

    URL.revokeObjectURL(editUserData.coverImage ?? '');
  };

  const cleanImage = (): void => {
    const imagesKey: Readonly<Partial<EditableData>[]> = [
      'avatar',
      'coverImage'
    ];

    imagesKey.forEach((image) =>
      URL.revokeObjectURL(editUserData[image] as string ?? '')
    );

    setUserImages({
       avatar: [],
      coverImage: []
    });
  };


  // const handleChange =
  //   (key: EditableData) =>
  //   ({
  //     target: { value }
  //   }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  //     setEditUserData({ ...editUserData, [key]: value });

  const handleKeyboardShortcut = ({
    key,
    target,
    ctrlKey
  }: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (ctrlKey && key === 'Enter' && !inputNameError) {
      const inputElement = target as HTMLInputElement | HTMLTextAreaElement;
      inputElement.blur();
      // void updateData();
    }
  };

  const inputFields: Readonly<RequiredInputFieldProps[]> = [
    {
      label: 'FullName',
      inputId: 'fullName',
      inputValue: editUserData.fullName,
      inputLimit: 50,
      errorMessage: inputNameError
    },
    {
      label: 'Bio',
      inputId: 'bio',
      inputValue: editUserData.bio,
      inputLimit: 160,
      useTextArea: true
    },
    {
      label: 'PhoneNumber',
      inputId: 'phoneNumber',
      inputValue: editUserData.phoneNumber,
      inputLimit: 12
    },
    {
      label: 'Date Of Birth',
      inputId: 'dateOfBirth',
      inputValue: editUserData.dateOfBirth,
      inputLimit: 11
    },

  ];

  return (
      <form onSubmit={handleSubmit} className={cn(hide && 'w-full h-full mx-auto p-6 bg-white rounded shadow')}>

        {/*<EditProfileModal*/}
        {/*    fullName={fullName}*/}
        {/*    loading={loading}*/}
        {/*    avatar={editUserData.avatar}*/}
        {/*    coverImage={editUserData.coverImage}*/}
        {/*    inputNameError={inputNameError}*/}
        {/*    editImage={editImage}*/}
        {/*    closeModal={closeModal}*/}
        {/*    updateData={updateData}*/}
        {/*    removeCoverImage={removeCoverImage}*/}
        {/*    resetUserEditData={resetUserEditData}*/}
        {/*>*/}

        {/*  {inputFields.map((inputData) => (*/}
        {/*      <InputField*/}
        {/*          {...inputData}*/}
        {/*          handleChange={handleChange(inputData.inputId)}*/}
        {/*          handleKeyboardShortcut={handleKeyboardShortcut}*/}
        {/*          key={inputData.inputId}*/}
        {/*      />*/}
        {/*  ))}*/}


        {/*</EditProfileModal>*/}
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
                disabled={!!values.email} // Thêm dòng này để disable input nếu phoneNumber đã có giá trị
            />
            {errors.email && touched.email ?
                <div className="text-red-700 text-sm">{errors.email}</div> : null}
          </div>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row">
          <div className="mr-2 flex-grow mb-2 sm:mb-0">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
                value={values.phoneNumber || ''}
                disabled={!!values.phoneNumber} // Thêm dòng này để disable input nếu phoneNumber đã có giá trị
            />
            {errors.phoneNumber && touched.phoneNumber ?
                <div className="text-red-700 text-sm">{errors.phoneNumber}</div> : null}
          </div>

          <div className="mr-2 flex-grow mb-2 sm:mb-0">
            <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm font-bold mb-2">Ngày Sinh</label>
            <input type="number" id="dateOfBirth" name="dateOfBirth"
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                   required onChange={handleChange} value={values.dateOfBirth || ''}/>
            {errors.dateOfBirth && touched.dateOfBirth ?
                <div className="text-red-700 text-sm">{errors.dateOfBirth}</div> : null}
          </div>

        </div>
        <div className="mb-4 flex flex-col sm:flex-row">
          <div className="mr-2 flex-grow mb-2 sm:mb-0">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Phone
              Number</label>
            <input type="text" id="phoneNumber" name="phoneNumber"
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                   required onChange={handleChange} value={values.phoneNumber || ''}/>
            {errors.phoneNumber && touched.phoneNumber ?
                <div className="text-red-700 text-sm">{errors.phoneNumber}</div> : null}
          </div>

          <div className="mr-2 flex-grow mb-2 sm:mb-0">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Phone
              Number</label>
            <input type="text" id="phoneNumber" name="phoneNumber"
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                   required onChange={handleChange} value={values.phoneNumber || ''}/>
            {errors.phoneNumber && touched.phoneNumber ?
                <div className="text-red-700 text-sm">{errors.phoneNumber}</div> : null}
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

      </form>
  );
}
