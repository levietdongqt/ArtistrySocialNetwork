'use client'
import { useAuth } from '../../../../context/auth-context';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { useModal } from "@lib/hooks/useModal";
import { Modal } from "../modal/modal";
import { DisplayModalLogin } from "../modal/display-modal-login";

export function LoginMain(): JSX.Element {
  const { open, openModal, closeModal } = useModal();
  const { signInWithFacebook, signInWithGoogle } = useAuth();
  return (
    <>
      <Modal
        modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
        open={open}
        closeModal={closeModal}
      >
        <DisplayModalLogin closeModal={closeModal} />
      </Modal>
      <main className='flex flex-col items-center justify-center gap-8'>
        <div className='flex flex-col items-center justify-center gap-6 p-8 lg:justify-center'>
          <div className='flex max-w-xs flex-row gap-4 font-twitter-chirp-extended lg:max-w-none lg:gap-16'>
            <CustomIcon
              className='mt-4 h-6 w-6 text-accent-blue lg:h-12 lg:w-12 dark:lg:text-twitter-icon'
              iconName='GameIcon'
            />
            <h1
              className='text-3xl before:content-["Social_Network"] lg:leading-normal
                       lg:text-5xl lg:before:content-["Social_Network"]'
            />
          </div>
          <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
            <div className='grid gap-3 font-bold'>
              <Button
                className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                         hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                         dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
                onClick={signInWithGoogle}
              >
                <CustomIcon iconName='GoogleIcon' /> Đăng nhập với Google
              </Button>
              <Button
                className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
                onClick={signInWithFacebook}
              >
                <CustomIcon iconName='FaceBookIcon' />Đăng nhập với Facebook
              </Button>
              <div className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-2'>
                <i className='border-b border-light-border dark:border-dark-border' />
                <p>or</p>
                <i className='border-b border-light-border dark:border-dark-border' />
              </div>
              <Button
                className='bg-accent-blue text-white transition hover:brightness-90
                         focus-visible:!ring-accent-blue/80 focus-visible:brightness-90 active:brightness-75'
                onClick={() => { console.log("Redirect to Register") }}
              >
                Đăng ký với số điện thoại
              </Button>
              {/* <p
                className='inner:custom-underline inner:custom-underline text-center text-xs
                         text-light-secondary inner:text-accent-blue dark:text-dark-secondary'
              >
                Bời đăng ký, bạn đồng ý với{' '}
                <a
                  href='https://twitter.com/tos'
                  target='_blank'
                  rel='noreferrer'
                >
                  Terms of Service
                </a>{' '}
                và {' '}
                <a
                  href='https://twitter.com/privacy'
                  target='_blank'
                  rel='noreferrer'
                >
                  Privacy Policy
                </a>
                , bao gồm{' '}
                <a
                  href='https://help.twitter.com/rules-and-policies/twitter-cookies'
                  target='_blank'
                  rel='noreferrer'
                >
                  Cookie Use
                </a>
                .
              </p> */}
            </div>
            <div className='flex flex-col gap-3'>
              <p className='font-bold text-center'>Bạn đã có tài khoản? </p>
              <Button
                className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                         focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                         dark:border-light-secondary'
                onClick={openModal}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
