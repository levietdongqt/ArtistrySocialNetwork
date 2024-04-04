
import { Aside } from '../aside/aside';
import { AsideTrends } from '../aside/aside-trends';
import { Suggestions } from '../aside/suggestions';
import { Placeholder } from '../common/placeholder';
import type { ReactNode } from 'react';
import { useAuth } from 'context/auth-context';
import {sleep} from "@lib/utils";
import {getPostsCount} from "../../../../services/realtime/clientRequest/postClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import useSWR from "swr";

export type LayoutProps = {
  children: ReactNode;
};

export function ProtectedLayout({ children }: LayoutProps) {
  const {data: data3, isLoading: loading} = useSWR(getPostsCount,fetcherWithToken);
    console.log("show " , loading)
  return <>
      {loading ?
      <Placeholder /> :
      {children}
      }</>;
}

export function HomeLayout({ children }: LayoutProps): JSX.Element {
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

export function UserLayout({ children }: LayoutProps): JSX.Element {
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

export function PeopleLayout({ children }: LayoutProps): JSX.Element {
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
