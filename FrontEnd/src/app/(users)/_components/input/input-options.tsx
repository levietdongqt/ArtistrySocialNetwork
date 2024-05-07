'use client'
import type {ChangeEvent, ClipboardEvent} from 'react';
import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Button} from '@components/ui/button';
import type {IconName} from '@components/ui/hero-icon';
import {HeroIcon} from '@components/ui/hero-icon';
import {ToolTip} from '@components/ui/tooltip';
import {variants} from './input';
import {ProgressBar} from './progress-bar';
import EmojiPicker, {EmojiStyle, Theme} from 'emoji-picker-react';
import {CustomIcon} from '@components/ui/custom-icon';
import cn from "clsx";
import {Popper} from "react-popper";
import {Popover} from "antd";
import * as repl from "node:repl";
type Options = {
  name: string;
  iconName: IconName;
  disabled: boolean;
  onClick?: () => void;
}[];

const options: Readonly<Options> = [
  {
    name: 'Media',
    iconName: 'PhotoIcon',
    disabled: false
  },
  {
    name: 'GIF',
    iconName: 'GifIcon',
    disabled: false
  },
  {
    name: 'Poll',
    iconName: 'ChartBarIcon',
    disabled: true
  },
  {
    name: 'Emoji',
    iconName: 'FaceSmileIcon',
    disabled: false
  },
  {
    name: 'Schedule',
    iconName: 'CalendarDaysIcon',
    disabled: true
  },
  {
    name: 'Location',
    iconName: 'MapPinIcon',
    disabled: true
  }
];

type InputOptionsProps = {
  reply?: boolean;
  childComments?:boolean;
  modal?: boolean;
  inputLimit: number;
  inputLength: number;
  isValidTweet: boolean;
  isCharLimitExceeded: boolean;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
  handleEmojiClick: (emoji: any) => void;
  callBack?: () => void;
};

export function InputOptions({
  reply,
                               childComments,
  modal,
  inputLimit,
  inputLength,
  isValidTweet,
  isCharLimitExceeded,
  handleImageUpload,
   handleEmojiClick,
                               callBack
}: InputOptionsProps): JSX.Element {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onClick = (): void => inputFileRef.current?.click();

  let filteredOptions = options;

  if (reply)
    filteredOptions = filteredOptions.filter(
      (_, index) => ![2, 4].includes(index)
    );
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        showEmojiPicker &&
        emojiPickerRef?.current &&
        !emojiPickerRef.current?.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleOptionClick = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    if (index === 0) {
      onClick();
    } else if (index === 3) {
      setShowEmojiPicker((prev) => !prev);
    }
  };
  const content = (
            <EmojiPicker
                theme={Theme.LIGHT}
                emojiStyle={EmojiStyle.TWITTER}
                width={320}
                height={400}
                lazyLoadEmojis={true}
                onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
            />
  )
  return (
    <motion.div className='flex justify-between' {...variants}>
      <div
        className='flex text-main-accent xs:[&>button:nth-child(n+6)]:hidden
                   md:[&>button]:!block [&>button:nth-child(n+4)]:hidden'
      >
        <input
          className='hidden'
          type='file'
          accept='image/*'
          onChange={handleImageUpload}
          ref={inputFileRef}
          multiple
        />
        <div>
          {filteredOptions.map(({ name, iconName, disabled },index) => (<>
                <Popover trigger="click" content={name === 'Emoji' && content} ref={emojiPickerRef}>
                  <Button
                      className={`accent-tab accent-bg-tab group relative rounded-full p-2
              hover:bg-main-accent/10 active:bg-main-accent/20 ${showEmojiPicker ? 'cursor-default' : 'cursor-pointer'}`}
                      onClick={(event) => handleOptionClick(event, index)}
                      disabled={disabled}
                      key={name}
                  >
                    <HeroIcon className='h-5 w-5' iconName={iconName} />
                    <ToolTip tip={name} modal={modal} />
                  </Button>
                </Popover>
          </>
          ))}
        </div>

      </div>
      <div id="emoji-picker-root"></div>
      <div className='flex items-center gap-4'>
        <motion.div
          className='flex items-center gap-4'
          animate={
            inputLength ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
        >
          <ProgressBar
            modal={modal}
            inputLimit={inputLimit}
            inputLength={inputLength}
            isCharLimitExceeded={isCharLimitExceeded}
          />
          {!reply && (
            <>
              <i className='hidden h-8 w-[1px] bg-[#B9CAD3] dark:bg-[#3E4144] xs:block' />
              <Button
                className='group relative hidden rounded-full border border-light-line-reply p-[1px]
                           text-main-accent dark:border-light-secondary xs:block'
                disabled
              >
                <HeroIcon className='h-5 w-5' iconName='PlusIcon' />
                <ToolTip tip='Add' modal={modal} />
              </Button>
            </>
          )}
        </motion.div>
        {
          childComments ? (
                <Button
                    className='accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                     enabled:hover:bg-main-accent/90
                     enabled:active:bg-main-accent/75'
                    disabled={!isValidTweet}
                    onClick={callBack}
                >
                  <HeroIcon iconName={'PaperAirplaneIcon'} className={'accent-accent-blue h-4 w-4'}/>
                  <ToolTip tip='Comment' modal={modal} />
                </Button>
            ) : (
              <Button
                  className='accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                     enabled:hover:bg-main-accent/90
                     enabled:active:bg-main-accent/75'
                  disabled={!isValidTweet}
                  onClick={callBack}
              >
                {'Post'}
              </Button>
          )
        }
      </div>
    </motion.div>
  );
}
