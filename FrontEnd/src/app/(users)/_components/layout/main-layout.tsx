'use client';
import { SWRConfig } from 'swr';
import { fetchJSON } from '@lib/config/SwrFetcherConfig';
import { WindowContextProvider } from '../../../../context/window-context';
import { Sidebar } from '../sidebar/sidebar';
import type { LayoutProps } from './common-layout';

export function MainLayout({ children }: LayoutProps) {
    console.log("MAIN LAYOUT MOUNT")
  return (
    <div className='flex w-full justify-center gap-0 lg:gap-4'>
      <WindowContextProvider>
        <Sidebar />
        <SWRConfig value={{ fetcher: fetchJSON,refreshInterval: 3000,revalidateOnFocus: false,revalidateOnReconnect: false,revalidateIfStale: false}}>
            {children}
        </SWRConfig>
      </WindowContextProvider>
    </div>
  );
}
