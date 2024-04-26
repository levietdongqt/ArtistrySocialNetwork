import { cn } from "@nextui-org/react";
import { UserLayout } from "../../_components/layout/common-layout";
import { UserDataLayout } from "../../_components/layout/user-data-layout";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main
        className={`hover-animation flex min-h-screen w-full max-w-5xl flex-col border-x-0
         border-light-border pb-96 dark:border-dark-border xs:border-x`}
      >
        {children}
      </main>
    </>
  );
}
