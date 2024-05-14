'use client'
import cn from 'clsx';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { preventBubbling } from '@lib/utils';
import { siteURL } from '@lib/env';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { variants } from './content-action';
import Link from "next/link";
import {bookmarksPost} from "../../../../services/realtime/ServerAction/bookmarksService";
import useSWR from "swr";
import {getBookmarksByUserId} from "../../../../services/realtime/clientRequest/bookmarksClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {useEffect, useState} from "react";

type PostShareProps = {
  userId: string;
  postId: string;
  viewTweet?: boolean;
  name?: string;
};

export function ContentShare({
  userId,
                               name,
  postId,
  viewTweet
}: PostShareProps): JSX.Element {



  const handleCopy = (closeMenu: () => void) => async (): Promise<void> => {
    closeMenu();
    await navigator.clipboard.writeText(`${siteURL}/post/${postId}`);
    toast.success('Đã copy to clipboard');
  };


  return (
    <Popover className='relative'>
      {({ open, close }): JSX.Element => (
        <>
          <Popover.Button
            className={cn(
              `group relative flex items-center gap-1 p-0 outline-none 
               transition-none hover:text-accent-blue focus-visible:text-accent-blue`,
              open && 'text-accent-blue inner:bg-accent-blue/10'
            )}
          >
            <i
              className='relative rounded-full p-2 not-italic duration-200 group-hover:bg-accent-blue/10 
                         group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-2 
                         group-focus-visible:ring-accent-blue/80 group-active:bg-accent-blue/20'
            >
              <HeroIcon
                className={viewTweet ? 'h-6 w-6' : 'h-5 w-5'}
                iconName='ArrowUpTrayIcon'
              />
              {!open && <ToolTip tip='Share' />}
            </i>
           {name}
          </Popover.Button>
          <AnimatePresence>
            {open && (
              <Popover.Panel
                className='menu-container group absolute right-0 top-11 whitespace-nowrap text-light-primary dark:text-dark-primary'
                as={motion.div}
                {...variants}
                static
              >
                <Popover.Button
                  className='accent-tab flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
                  as={Button}
                  onClick={preventBubbling(handleCopy(close))}
                >
                  <HeroIcon iconName='LinkIcon' />
                  Copy đường dẫn post
                </Popover.Button>

              </Popover.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
}
