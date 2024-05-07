'use client'
import {useRef, useEffect, useState} from 'react';
import cn from 'clsx';
import { Dialog } from '@headlessui/react';
import { Button } from '@components/ui/button';
import { CustomIcon } from '@components/ui/custom-icon';
import {Form, Input, Select, Space,} from "antd";
import TextArea from "react-textarea-autosize";
import {useFormik} from "formik";



type ActionModalProps = {
  report?: boolean;
  title: string;
  useIcon?: boolean;
  description: string;
  mainBtnLabel: string;
  focusOnMainBtn?: boolean;
  mainBtnClassName?: string;
  secondaryBtnLabel?: string;
  secondaryBtnClassName?: string;
  actionReport?: (value:string , content:string) => void;
  action: () => void;
  closeModal: () => void;
};

export function ActionModal({
  title,
  useIcon,
  description,
  mainBtnLabel,
  focusOnMainBtn,
  mainBtnClassName,
  secondaryBtnLabel,
  secondaryBtnClassName,
  actionReport,
  action,
  closeModal,
                              report
}: ActionModalProps): JSX.Element {
  const mainBtn = useRef<HTMLButtonElement>(null);
  const [valueSelect, setValueSelect] = useState<string>("");
  const [valueTextArea, setValueTextArea] = useState<string>("");
  useEffect(() => {
    if (!focusOnMainBtn) return;
    const timeoutId = setTimeout(() => mainBtn.current?.focus(), 50);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSelectValue = (value: string) => {
    setValueSelect(value);
  };

  const options =[
    { value: 'Ảnh khỏa thân', label: 'Ảnh khỏa thân' },
    { value: 'Spam', label: 'Spam' },
    { value: 'Bán hàng trái phép', label: 'Bán hàng trái phép' },
    { value: 'Bạo lực', label: 'Bạo lực' },
    { value: 'Liên quan đến trẻ em', label: 'Liên quan đến trẻ em' },
    { value: 'Thông tin sai sự thật', label: 'Thông tin sai sự thật' },
    { value: 'Quấy rối', label: 'Quấy rối' },
    { value: 'Vấn đề khác', label: 'Vấn đề khác' },
  ]
  return (
      <div className='flex flex-col gap-6'>
        <Form onFinish={() => {
          report ? actionReport(valueSelect, valueTextArea) : action();
        }}>
          <div className='flex flex-col gap-4'>
            {useIcon && (
                <i className='mx-auto'>
                  <CustomIcon
                      className='h-10 w-10 text-accent-blue dark:text-twitter-icon'
                      iconName='GameIcon'
                  />
                </i>
            )}
            <div className='flex flex-col gap-2'>
              <Dialog.Title className={cn(`text-xl font-bold`, report ? 'text-center ' : '')}>{title}</Dialog.Title>
              <Dialog.Description className={cn(`text-light-secondary dark:text-dark-secondary`,
                  report ? 'text-sm text-gray-400' : '')}>
                {description}
              </Dialog.Description>
            </div>

            {report && (<div className={'flex flex-col gap-2'}>
              <div>
                <p className={'text-accent-blue mb-1'}>Tiêu đề</p>
                <Form.Item name={'select'} rules={[{required:true,message:'Chọn tiêu đề muốn báo cáo'}]} >
                  <Select
                      defaultValue="Chọn Tiêu đề bạn muốn báo cáo"
                      className={'w-full'}
                      onChange={handleSelectValue}
                      options={options}
                  />
                </Form.Item>
              </div>
              <div>
                <p className={'text-accent-blue mb-1'}>Nội dung</p>
                <TextArea onChange={(e) => setValueTextArea(e.target.value)}
                          className={'w-full border-black border-solid border-[1.5px] rounded py-1 px-4 min-w-0 resize-none bg-transparent text-[17px] placeholder:text-light-secondary dark:placeholder:text-dark-secondary'}
                          maxRows={6} minRows={6}/>
              </div>
            </div>)}
          </div>
          <div className='flex flex-col gap-3 inner:py-2 inner:font-bold'>
            <Button
                type='submit'
                ref={mainBtn}
                className={cn(
                    'custom-button main-tab text-white',
                    mainBtnClassName ??
                    `bg-light-primary hover:bg-light-primary/90 focus-visible:bg-light-primary/90 active:bg-light-primary/80
               dark:bg-light-border dark:text-light-primary dark:hover:bg-light-border/90
               dark:focus-visible:bg-light-border/90 dark:active:bg-light-border/75`
                )}
            >
              {mainBtnLabel}
            </Button>
            <Button
                className={cn(
                    'border border-light-line-reply dark:border-light-secondary dark:text-light-border',
                    secondaryBtnClassName ??
                    `hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20
               dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20`
                )}
                onClick={closeModal}
            >
              {secondaryBtnLabel ?? 'Cancel'}
            </Button>
          </div>
        </Form>
      </div>
  );
}
