'use client'
import { AnimatePresence } from 'framer-motion';
import {UserDataLayout} from "../../../../_components/layout/user-data-layout";
import {UserLayout} from "../../../../_components/layout/common-layout";
import {UserHomeLayout} from "../../../../_components/layout/user-home-layout";
import {SEO} from "../../../../_components/common/seo";
import {Loading} from "@components/ui/loading";
import {ServiceProvider} from "../../../../services/[id]/service-provider";
import PostUser from "./post-user";


export default function UserPost(): JSX.Element {


  return (


                          <section>
                                  <AnimatePresence mode='popLayout'>
                                      <PostUser  />
                                  </AnimatePresence>
                          </section>

  );
}
