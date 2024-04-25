import { UserLayout } from "app/(users)/_components/layout/common-layout";
import { UserDataLayout } from "app/(users)/_components/layout/user-data-layout";
import { UserHomeLayout } from "app/(users)/_components/layout/user-home-layout";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <UserLayout>
      <UserDataLayout>
        
          <UserHomeLayout>{children}</UserHomeLayout>
        
      </UserDataLayout>
      </UserLayout>
    </>
  );
}
