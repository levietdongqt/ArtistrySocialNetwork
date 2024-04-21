import {useState, useEffect, ChangeEvent, type KeyboardEvent} from 'react';
import { toast } from 'react-toastify';

import {useParams} from "next/navigation";
import {useUser} from "../../../context/user-context";
import {EditableData, EditableUserData, User} from "@models/user";
import useSWR from "swr";
import {InputField, InputFieldProps} from "../_components/input/input-field";
import {FilesWithId} from "@models/file";
import {useModal} from "@lib/hooks/useModal";
import {getUserById} from "../../../services/main/clientRequest/userClient";
import {uploadImages} from "../../../firebase/utils";
import {getImagesData} from "@lib/validation";
import {EditProfileModal} from "../_components/modal/edit-profile-modal";
import cn from "clsx";
import {sleep} from "@lib/utils";


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
  const [loading, setLoading] = useState(false);
  const { bio, fullName, location, avatar, coverImage, phoneNumber,dateOfBirth } =
    currentUser as User;
  const { ID } = useParams();
  const {data,isLoading} = useSWR(getUserById(ID as string));

  const [editUserData, setEditUserData] = useState<EditableUserData>({
    bio,
    fullName,
    avatar,
    location,
    coverImage,
    phoneNumber,
    dateOfBirth
  });

  const [userImages, setUserImages] = useState<UserImages>({
    avatar: [],
    coverImage: []
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanImage, []);

  const inputNameError = !editUserData.fullName?.trim()
    ? "Name can't be blank"
    : '';

  const updateData = async (): Promise<void> => {
    setLoading(true);

    const userId = currentUser?.id as string;

    const { avatar, coverImage: coverURL } = userImages;

    const [newPhotoURL, newCoverPhotoURL] = await Promise.all(
      [avatar, coverURL].map((image) => uploadImages(userId, image))
    );

    const newImages: Partial<Pick<User, 'avatar' | 'coverImage'>> = {
      coverImage:
          coverImage === editUserData.coverImage
          ? coverImage
          : newCoverPhotoURL?.[0].src ?? null,
      ...(newPhotoURL && { photoURL: newPhotoURL[0].src })
    };

    const trimmedKeys: Readonly<EditableData[]> = [
      'fullName',
      'bio',
      // 'location',
      // 'website'
    ];

    const trimmedTexts = trimmedKeys.reduce(
      (acc, curr) => ({ ...acc, [curr]: editUserData[curr] ?? null }),
      {} as TrimmedTexts
    );


    const newUserData: Readonly<EditableUserData> = {
      ...editUserData,
      ...trimmedTexts,
      ...newImages
    };

    await sleep(500);

    /*await updateUserData(userId, newUserData);*/

    closeModal();

    cleanImage();

    setLoading(false);
    setEditUserData(newUserData);

    toast.success('Profile updated successfully');
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

  const resetUserEditData = (): void =>
    setEditUserData({
      bio,
      fullName,
      avatar,
      location,
      coverImage,
      phoneNumber,
      dateOfBirth
    });

  const handleChange =
      (key: EditableData) =>
          ({
             target: { value }
           }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setEditUserData({ ...editUserData, [key]: value });

  const handleKeyboardShortcut = ({
                                    key,
                                    target,
                                    ctrlKey
                                  }: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (ctrlKey && key === 'Enter' && !inputNameError) {
      const inputElement = target as HTMLInputElement | HTMLTextAreaElement;
      inputElement.blur();
      void updateData();
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
    <form className={cn(hide && 'hidden md:block')}>

        <EditProfileModal
          fullName={fullName}
          loading={loading}
          avatar={editUserData.avatar}
          coverImage={editUserData.coverImage}
          inputNameError={inputNameError}
          editImage={editImage}
          closeModal={closeModal}
          updateData={updateData}
          removeCoverImage={removeCoverImage}
          resetUserEditData={resetUserEditData}
        >
          {inputFields.map((inputData) => (
            <InputField
              {...inputData}
              handleChange={handleChange(inputData.inputId)}
              handleKeyboardShortcut={handleKeyboardShortcut}
              key={inputData.inputId}
            />
          ))}
        </EditProfileModal>


    </form>
  );
}
