
import { useRequireAuth } from '@lib/hooks/useRequireAuth';
import { Aside } from '../aside/aside';
import { AsideTrends } from '../aside/aside-trends';
import { Suggestions } from '../aside/suggestions';
import { Placeholder } from '../common/placeholder';
import type { ReactNode } from 'react';
import { useAuth } from 'context/auth-context';

export type LayoutProps = {
  children: ReactNode;
};

export function ProtectedLayout({ children }: LayoutProps) {
  const user = useAuth();
  console.log("Asdasdasd123123 ",user);
  if (!user) return <Placeholder />;
  return <>{children}</>;
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
