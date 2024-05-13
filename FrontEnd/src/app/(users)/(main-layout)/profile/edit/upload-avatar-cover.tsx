'use client'
import React, { useEffect,useState, useRef, ChangeEvent } from "react";
import {NextImage} from "@components/ui/next-image";
import {Button} from "@components/ui/button";
import {HeroIcon} from "@components/ui/hero-icon";
import {ToolTip} from "@components/ui/tooltip";
import {useUser} from "../../../../../context/user-context";
import {useUpload} from "../../../../../context/uploadfile-context";


interface FileListType {
    originFileObj?: File;
    url?: string;
    preview?: string;
}

// Giả định interface này để lưu giá trị fullName, coverImage, và avatar
interface Values {
    fullName: string;
    coverImage?: string | null;
    avatar?: string | null;
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const UploadProfileImage = () => {
    const {files,setFiles} = useUpload();
    const { currentUser } = useUser();
    const [values, setValues] = useState<Values>({
        fullName: '',
        avatar: '',
        coverImage: ''
    });
    const profileInputFileRef = useRef<HTMLInputElement>(null);
    const coverInputFileRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (currentUser) {
            setValues({
                fullName: currentUser?.fullName,
                avatar: currentUser?.avatar,
                coverImage: currentUser?.coverImage
            });
        }
    }, [currentUser]);

    const handleClick = (type: 'cover' | 'profile') => () => {
        if (type === 'cover' && coverInputFileRef.current) {
            coverInputFileRef.current.click();
        } else if (type === 'profile' && profileInputFileRef.current) {
            profileInputFileRef.current.click();
        }
    };

    const editImage = (type: 'cover' | 'profile') => async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            // Tạo một tên file mới dựa trên loại và thời gian hiện tại
            const newName = `${type === 'profile' ? 'avatar' : 'coverimage'}${Date.now()}`;
            // Tạo một đối tượng Blob mới từ file gốc và gán tên mới cho nó
            const newBlob = new Blob([file], { type: file.type });
            const newFile = new File([newBlob], newName, { type: file.type });

            const base64 = await getBase64(newFile);
            setValues(prevValues => ({
                ...prevValues,
                [type === 'cover' ? 'coverImage' : 'avatar']: base64 as string
            }));


            setFiles((prevFiles) => {

                const filteredFiles = prevFiles.filter((f) => {
                    const prefix = type === 'profile' ? 'avatar' : 'coverimage';
                    return !f.name.startsWith(prefix);
                });
                // Thêm file mới vào mảng
                const updatedFiles = [...filteredFiles, newFile];

                // Log mảng files mới để kiểm tra
                console.log('Updated files array:', updatedFiles);

                return updatedFiles;
            });
        }
    };



    return (
        <>
            <div className='group relative my-2 h-36 xs:h-44 sm:h-48'>
                <input
                    className='hidden'
                    type='file'
                    accept='image/*'
                    ref={coverInputFileRef}
                    onChange={editImage('cover')}
                />
                {values.coverImage ? (
                    <NextImage
                        useSkeleton
                        className='relative h-full'
                        imgClassName='object-cover transition group-hover:brightness-75 duration-200 group-focus-within:brightness-75'
                        src={values.coverImage}
                        alt={values.fullName}
                        layout='fill'
                    />
                ) : (
                    <div className='h-full bg-light-line-reply dark:bg-dark-line-reply'/>
                )}

                <div className='absolute left-1/2 top-1/2 flex -translate-y-1/2 -translate-x-1/2 gap-4'>
                    <Button
                        className='group/inner relative bg-light-primary/60 p-2 hover:bg-image-preview-hover/50
                         focus-visible:bg-image-preview-hover/50'
                        onClick={handleClick('cover')}
                    >
                        <HeroIcon iconName='CameraIcon' className='hover-animation h-6 w-6 text-dark-primary group-hover:text-white'/>
                        <ToolTip tip='Add photo'/>
                    </Button>
                </div>
            </div>
            <div className='relative flex flex-col gap-6 px-4 py-3'>
                <div className='mb-8 xs:mb-12 sm:mb-14'>
                    <input
                        className='hidden'
                        type='file'
                        accept='image/*'
                        ref={profileInputFileRef}
                        onChange={editImage('profile')}
                    />
                    {values.avatar ? (
                        <div
                            className='group absolute aspect-square w-24 -translate-y-1/2
                         overflow-hidden rounded-full xs:w-32 sm:w-36'
                        >
                            <NextImage
                                useSkeleton
                                className='h-full w-full bg-main-background inner:!m-1 inner:rounded-full'
                                imgClassName='rounded-full transition group-hover:brightness-75 duration-200
                              group-focus-within:brightness-75'
                                src={values.avatar}
                                alt={values.fullName}
                                layout='fill'
                            />
                            <Button
                                className='group/inner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                           bg-light-primary/60 p-2 hover:bg-image-preview-hover/50
                           focus-visible:bg-image-preview-hover/50'
                                onClick={handleClick('profile')}
                            >
                                <HeroIcon
                                    className='hover-animation h-6 w-6 text-dark-primary group-hover:text-white'
                                    iconName='CameraIcon'
                                />
                                <ToolTip groupInner tip='Add photo'/>
                            </Button>
                        </div>
                    ) : (
                        // Placeholder khi chưa có ảnh avatar
                        <div className='h-full w-full bg-light-line-reply dark:bg-dark-line-reply'>
                            <Button
                                className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-light-primary/60 p-2 hover:bg-image-preview-hover/50'
                                onClick={handleClick('profile')}
                            >
                                <HeroIcon iconName='CameraIcon'
                                          className='hover-animation h-6 w-6 text-dark-primary group-hover:text-white'/>
                                <ToolTip tip='Add photo'/>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UploadProfileImage;