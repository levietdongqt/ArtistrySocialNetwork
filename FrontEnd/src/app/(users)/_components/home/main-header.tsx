import cn from 'clsx';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { MobileSidebar } from '../sidebar/mobile-sidebar';
import type { ReactNode } from 'react';
import type { IconName } from '@components/ui/hero-icon';
import React from "react";
import {SearchBar} from "../aside/search-bar";

type HomeHeaderProps = {
  tip?: string;
  title?: string;
  children?: ReactNode;
  iconName?: IconName;
  className?: string;
  disableSticky?: boolean;
  useActionButton?: boolean;
  useMobileSidebar?: boolean;
  action?: () => void;
  search?: string;
};

export function MainHeader({
  tip,
  title,
  children,
  iconName,
  className,
  disableSticky,
  useActionButton,
  useMobileSidebar,
  action, search
}: HomeHeaderProps): JSX.Element {
  return (
    <header
      className={cn(
        'hover-animation even z-10 bg-main-background/60 px-4 py-2 backdrop-blur-md',
        !disableSticky && 'sticky top-0',
        className ?? 'flex items-center gap-6'
      )}
    >
      {useActionButton && (
        <Button
          className='dark-bg-tab group relative p-2 hover:bg-light-primary/10 active:bg-light-primary/20 
                     dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
          onClick={action}
        >
          <HeroIcon
            className='h-5 w-5'
            iconName={iconName ?? 'ArrowLeftIcon'}
          />
          <ToolTip tip={tip ?? 'Back'} />
        </Button>
      )}
      {title && (
        <div className='flex gap-8'>
          {useMobileSidebar && <MobileSidebar />}
          <h2 className='text-xl font-bold' key={title}>
            {title}
          </h2>
        </div>
      )}
      {
        search && (
            <>
            
             <SearchBar width='520px'/>
              <Button
                  className='dark-bg-tab group relative p-2 hover:bg-light-primary/10 active:bg-light-primary/20
                     dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
                  onClick={() => {}}
              >
                <HeroIcon
                    className='h-5 w-5'
                    iconName={iconName ?? 'EllipsisHorizontalIcon'}
                />
                <ToolTip tip={tip ?? 'settings'} />
              </Button>
            </>
          )
      }
      {children}
    </header>
  );
}
