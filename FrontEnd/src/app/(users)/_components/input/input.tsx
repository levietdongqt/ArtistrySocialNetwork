'use client'
import {useState, useEffect, useRef, useId} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import cn from 'clsx';
import {toast} from "react-toastify";
import {sleep} from '@lib/utils';
import {getImagesData} from '@lib/validation';
import {UserAvatar} from '../user/user-avatar';
import {InputForm} from './input-form';
import {ImagePreview} from './image-preview';
import {InputOptions} from './input-options';
import type {ReactNode, FormEvent, ChangeEvent, ClipboardEvent} from 'react';
import type {Variants} from 'framer-motion';
import type {FilesWithId, ImagesPreview, ImageData} from '@models/file';
import {useUser} from "../../../../context/user-context";
import { postPosts1} from "../../../../services/realtime/ServerAction/PostService";
import {uploadImages} from "../../../../firebase/utils";
import {postComment} from "../../../../services/realtime/ServerAction/CommentService";
import {Popover} from "antd";
import useSWR from "swr";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";

import {getFriendByUserId} from "../../../../services/main/clientRequest/friendsClient";


type InputProps = {
  postID?: string;
  modal?: boolean;
  reply?: boolean;
  comment?: boolean;
  parent?: { id: string; username: string };
  disabled?: boolean;
  children?: ReactNode;
  replyModal?: boolean;
  closeModal?: () => void;
};

export const variants: Variants = {
    initial: {opacity: 0},
    animate: {opacity: 1}
};

export function Input({
  postID,
  modal,
  reply,
  parent,
  comment,
  disabled,
  children,
  replyModal,
  closeModal
}: InputProps): JSX.Element {
  const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
  const [imagesPreview, setImagesPreview] = useState<ImagesPreview>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [visited, setVisited] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [options, setOptions] = useState("");
  const {currentUser} = useUser();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCheckTrigger, setIsCheckTrigger] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewCount = imagesPreview.length;
  const isUploadingImages = !!previewCount;
  const isAdmin = false;
  useEffect(
    () => {
      if (modal) inputRef.current?.focus();
      return cleanImage;
    },
    []
  );

  const sendPost = async (): Promise<void> => {
    try {
    inputRef.current?.blur();
    setLoading(true);
    const userId = currentUser?.id as string;
    const uploadedImagesData = await uploadImages(userId, selectedImages);
    console.log("Uploaded images: ",uploadedImagesData)
  if(currentUser !== null){
    if(!comment){
      const postData = {
        content: inputValue.trim() || null,
        mediaUrl: uploadedImagesData ? uploadedImagesData?.map(imageObject => imageObject) : [],
        sendUserId: userId || null,
        sendFullName: currentUser?.fullName || null,
        sendUserAvatarUrl: currentUser?.avatar || "",
        sendUserCoverImage: currentUser?.coverImage || null,
        sendUserBio: currentUser?.bio || null,
        sendVerified: currentUser?.verified
      } as any;
      await sleep(200);
      await postPosts1(postData);
    }else{
      const commentData = {
        postId: postID,
        content: inputValue.trim() || null,
        mediaUrl: uploadedImagesData ? uploadedImagesData.map(imageObject => imageObject) : [],
        byUser: {
          id: currentUser?.id as string,
          fullName: currentUser?.fullName as string || null,
          avatar: currentUser?.avatar || null,
          coverImage: currentUser?.coverImage as string || null,
          bio: currentUser?.bio as string || null,
          verified: currentUser?.verified
        }
      };
      await sleep(200);
      await postComment(commentData);
    }
  }else{
    toast.error('bạn cần phải đăng nhập mới đăng bài');
  }
    if (!modal && !replyModal) {
      discardTweet();
    }
  }catch (error) {
    console.log("gửi thất bại");
  }finally {
      if(!comment && currentUser != null){
        toast.success(
            <span className='flex gap-2'>
          Đăng bài thành công
      </span>
        );
        setLoading(false);
        if (closeModal) closeModal();
      }
      discardTweet();
      setLoading(false);
    }
  };

  const handleEmojiClick = (emoji:any) => {
    setSelectedEmoji(emoji.emoji);
    setInputValue((prevInputValue) => prevInputValue + emoji.emoji);
  };
  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    const isClipboardEvent = 'clipboardData' in e;

    if (isClipboardEvent) {
      const isPastingText = e.clipboardData.getData('text');
      if (isPastingText) return;
    }
    const files = isClipboardEvent ? e.clipboardData.files : e.target.files;
    const imagesData = getImagesData(files, previewCount);
    if (!imagesData) {
      toast.error('Please choose a GIF or photo up to 10');
      return;
    }
    const { imagesPreviewData, selectedImagesData } = imagesData;

    setImagesPreview([...imagesPreview, ...imagesPreviewData]);
    setSelectedImages([...selectedImages, ...selectedImagesData]);
    console.log("selectedImages11",selectedImages)
    inputRef.current?.focus();
  };

  const removeImage = (targetId: string) => (): void => {
    setSelectedImages(selectedImages.filter(({ id }) => id !== targetId));
    setImagesPreview(imagesPreview.filter(({ id }) => id !== targetId));

    const { src } = imagesPreview.find(
      ({ id }) => id === targetId
    ) as ImageData;

    URL.revokeObjectURL(src);
  };

  const cleanImage = (): void => {
    imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src));
    setSelectedImages([]);
    setImagesPreview([]);
  };

  const discardTweet = (): void => {
    setInputValue('');
    setVisited(false);
    cleanImage();

    inputRef.current?.blur();
  };

  const handleChange = ({
    target: { value }
  }: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(value)
  };

  const {data:friends} = useSWR(getFriendByUserId(currentUser?.id as string),fetcherWithToken);



  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void sendPost();
  };
  const handleFocus = (): void => setVisited(!loading);

  const formId = useId();

  const inputLimit = isAdmin ? 560 : 280;

  const inputLength = inputValue.length;
  const isValidInput = !!inputValue.trim().length;
  const isCharLimitExceeded = inputLength > inputLimit;

  const isValidTweet =
    !isCharLimitExceeded && (isValidInput || isUploadingImages);

  return (
    <form
      className={cn('flex flex-col', {
        '-mx-4': reply,
        'gap-2': replyModal,
        'cursor-not-allowed': disabled,
      })}
      onSubmit={handleSubmit}
    >
      {loading && (
        <motion.i className='h-1 animate-pulse bg-main-accent' {...variants} />
      )}
      {children}
        <label
            className={cn(
                'hover-animation grid w-full grid-cols-[auto,1fr] gap-3 px-4 py-3',
                reply
                    ? 'pt-3 pb-1'
                    : replyModal
                        ? 'pt-0'
                        : 'border-b-2 border-light-border dark:border-dark-border',
                (disabled || loading) && 'pointer-events-none opacity-50',
                {
                  'sticky z-10 bottom-[0px] bg-white dark:bg-white pt-2': comment
                }
            )}
            htmlFor={formId}
        >
          <UserAvatar src={currentUser?.avatar as string} alt={currentUser?.fullName as string} username={currentUser?.fullName as string} />
          <div className='flex w-full flex-col gap-4'>
            <InputForm
                modal={modal}
                reply={reply}
                comment={comment}
                formId={formId}
                visited={visited}
                loading={loading}
                inputRef={inputRef}
                replyModal={replyModal}
                inputValue={inputValue}
                isValidTweet={isValidTweet}
                isUploadingImages={isUploadingImages}
                sendPost={sendPost}
                handleFocus={handleFocus}
                discardTweet={discardTweet}
                handleChange={handleChange}
                handleImageUpload={handleImageUpload}
            >
              {isUploadingImages && (
                  <ImagePreview
                      imagesPreview={imagesPreview}
                      previewCount={previewCount}
                      removeImage={!loading ? removeImage : undefined}
                  />
              )}
            </InputForm>
            <AnimatePresence initial={false}>
              {(reply ? reply && visited && !loading : !loading) && (
                  <InputOptions
                      reply={reply}
                      modal={modal}
                      inputLimit={inputLimit}
                      inputLength={inputLength}
                      isValidTweet={isValidTweet}
                      isCharLimitExceeded={isCharLimitExceeded}
                      handleImageUpload={handleImageUpload}
                      handleEmojiClick={handleEmojiClick}
                  />
              )}
            </AnimatePresence>
          </div>
        </label>

    </form>
  );
}
