
import { useEffect } from 'react';
import TextArea from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '../modal/modal';
import { ActionModal } from '../modal/action-modal';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import type {
  ReactNode,
  RefObject,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent
} from 'react';
import type { Variants } from 'framer-motion';
import cn from "clsx";

type InputFormProps = {
  modal?: boolean;
  formId: string;
  loading: boolean;
  visited: boolean;
  reply?: boolean;
  children: ReactNode;
  inputRef: RefObject<HTMLTextAreaElement>;
  inputValue: string;
  replyModal?: boolean;
  isValidTweet: boolean;
  isUploadingImages: boolean;
  sendPost: () => Promise<void>;
  handleFocus: () => void;
  discardTweet: () => void;
  handleChange: ({
    target: { value }
  }: ChangeEvent<HTMLTextAreaElement>) => void;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
};

const variants: Variants[] = [
  {
    initial: { y: -25, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring' } }
  },
  {
    initial: { x: 25, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring' } }
  }
];

export const [fromTop, fromBottom] = variants;

export function   InputForm({
  modal,
  reply,
  formId,
  loading,
  visited,
  children,
  inputRef,
  replyModal,
  inputValue,
  isValidTweet,
  isUploadingImages,
  sendPost,
  handleFocus,
  discardTweet,
  handleChange,
  handleImageUpload
}: InputFormProps): JSX.Element {
  const { open, openModal, closeModal } = useModal();

  useEffect(() => handleShowHideNav(true), []);

  const handleKeyboardShortcut = ({
    key,
    ctrlKey
  }: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!modal && key === 'Escape')
      if (isValidTweet) {
        inputRef.current?.blur();
        openModal();
      } else discardTweet();
    else if (ctrlKey && key === 'Enter' && isValidTweet) void sendPost();
  };

  const handleShowHideNav = (blur?: boolean) => (): void => {
    const sidebar = document.getElementById('sidebar') as HTMLElement;

    if (!sidebar) return;

    if (blur) {
      setTimeout(() => (sidebar.style.opacity = ''), 200);
      return;
    }

    if (window.innerWidth < 500) sidebar.style.opacity = '0';
  };

  const handleFormFocus = (): void => {
    handleShowHideNav()();
    handleFocus();
  };

  const handleClose = (): void => {
    discardTweet();
    closeModal();
  };

  const isVisibilityShown = visited && !reply && !replyModal && !loading;

  return (
    <div className='flex min-h-[48px] w-full flex-col justify-center gap-4'>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          title='Discard Content?'
          description='This can’t be undone and you’ll lose your draft.'
          mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75'
          mainBtnLabel='Discard'
          action={handleClose}
          closeModal={closeModal}
        />
      </Modal>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-3'>
          <TextArea
            id={formId}
            className={cn(`w-full min-w-0 resize-none  bg-transparent text-xl outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary`, reply ? 'h-[45px] !important' : '')}
            value={inputValue}
            placeholder={
              reply || replyModal ? 'Viết bình luận' : "Bạn đang nghĩ gì thế....."
            }
            onBlur={handleShowHideNav(true)}
            minRows={loading ? 1 : modal && !isUploadingImages ? 3 : 1}
            maxRows={isUploadingImages ? 5 : 15}
            onFocus={handleFormFocus}
            onPaste={handleImageUpload}
            onKeyUp={handleKeyboardShortcut}
            onChange={handleChange}
            ref={inputRef}
          />
          {reply && !visited && (
            <Button
              className='cursor-pointer bg-main-accent px-4 py-1.5 font-bold text-white opacity-50'
              onClick={handleFocus}
            >
              Reply
            </Button>
          )}
        </div>
      </div>
      {children}
      {isVisibilityShown && (<motion.div
          className='flex border-b border-light-border pb-2 dark:border-dark-border'
          {...fromBottom}
        >
          <button
              type='button'
              className='custom-button accent-tab accent-bg-tab flex cursor-not-allowed items-center gap-1 py-0
                       px-3 text-main-accent hover:bg-main-accent/10 active:bg-main-accent/20'
          >
            <HeroIcon className='h-4 w-4' iconName='GlobeAmericasIcon' />
            <p className='font-bold'>Mọi người có thể reply</p>
          </button>
        </motion.div>)
        }
      </div>
  );
}
