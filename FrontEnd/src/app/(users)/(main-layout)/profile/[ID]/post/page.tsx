'use client'
import { AnimatePresence } from 'framer-motion';
import {UserDataLayout} from "../../../../_components/layout/user-data-layout";
import {UserLayout} from "../../../../_components/layout/common-layout";
import {UserHomeLayout} from "../../../../_components/layout/user-home-layout";
import {SEO} from "../../../../_components/common/seo";
import {Loading} from "@components/ui/loading";
import {ServiceProvider} from "../../../../services/[id]/service-provider";
import PostUser from "./post-user";
import InputMobile from "../../../../_components/input/InputMobile";
import React from "react";
import {Input} from "../../../../_components/input/input";
import {useWindow} from "../../../../../../context/window-context";


export default function UserPost(): JSX.Element {
    const { isMobile } = useWindow();
  return (
      <>
          {!isMobile && <Input profile />}
          <section>
              <AnimatePresence mode='popLayout'>
                  <PostUser/>
              </AnimatePresence>
          </section>
      </>
  );
}
