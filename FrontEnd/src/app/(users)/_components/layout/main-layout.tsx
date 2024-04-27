'use client';
import { SWRConfig } from 'swr';
import { fetchJSON } from '@lib/config/SwrFetcherConfig';
import { WindowContextProvider } from '../../../../context/window-context';
import { Sidebar } from '../sidebar/sidebar';
import type { LayoutProps } from './common-layout';

export function MainLayout({ children }: LayoutProps) {

  return (
    <div className='flex w-full justify-center gap-0 lg:gap-4'>
      <WindowContextProvider>
        <Sidebar />
        <SWRConfig value={{ fetcher: fetchJSON}}>
            {children}
        </SWRConfig>
      </WindowContextProvider>
    </div>
  );
}
