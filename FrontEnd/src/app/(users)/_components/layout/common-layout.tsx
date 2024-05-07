'use client'
import { Aside } from '../aside/aside';
import { AsideTrends } from '../aside/aside-trends';
import { Suggestions } from '../aside/suggestions';
import { Placeholder } from '../common/placeholder';
import type { ReactNode } from 'react';

import {sleep} from "@lib/utils";
import {getPostsCount} from "../../../../services/realtime/clientRequest/postClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import useSWR from "swr";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ServiceProvider} from "../../services/[id]/service-provider";
import {ServiceAll} from "../../services/[id]/service-all";

export type LayoutProps = {
  children: ReactNode;
};

export function ProtectedLayout({ children }: LayoutProps) {

  return <>
      {children}
      </>;
}

export function HomeLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <AsideTrends />
        <Suggestions />
          <ServiceAll />
      </Aside>
    </>
  );
}

export function UserLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <Suggestions />
        <ServiceProvider />
      </Aside>
    </>
  );
}
export function SearchLayout({ children }: LayoutProps): JSX.Element {
    return (
        <>
            {children}
            <Aside>
                <Suggestions />
                <AsideTrends />
            </Aside>
        </>
    );
}
export function StudioLayout({ children }: LayoutProps): JSX.Element {
    return (
        <>
            {children}
            <Aside>
                <Suggestions />
                <AsideTrends />
            </Aside>
        </>
    );
}

export function TrendsLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <Suggestions />
      </Aside>
    </>
  );
}

export function FriendLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <AsideTrends />
      </Aside>
    </>
  );
}

export function NotificationLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <AsideTrends />
        <Suggestions />
      </Aside>
    </>
  );
}
