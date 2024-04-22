'use client'
import { useWindow } from '../../../../context/window-context';
import { SearchBar } from './search-bar';
import { AsideFooter } from './aside-footer';
import type { ReactNode } from 'react';
import {useSearchParams} from "next/navigation";
import {MobileSidebar} from "../sidebar/mobile-sidebar";
import React from "react";
type AsideProps = {
  children: ReactNode;
};

export function Aside({ children }: AsideProps): JSX.Element | null {
  const { width } = useWindow();
  const search = useSearchParams();
    const isSearching = search.has('q');
    if (width < 1024) return null;

    return (
        <aside className='flex w-96 flex-col gap-4 px-4 py-3 pt-1'>
            {isSearching ? (
                <div className='hover-animation sticky top-0 z-10 -my-2 bg-main-background py-2 w-full'>
                    <h2 className='group flex items-center justify-between gap-4 rounded-full
                   bg-black px-4 py-2 transition focus-within:bg-main-background
                   focus-within:ring-2 focus-within:ring-main-accent text-xl font-bold'>
                        searching....
                    </h2>
                </div>
            ) : (
                <SearchBar width='350px' />
            )}
            {children}
            <AsideFooter key={'footer'} />
        </aside>
    );
}
