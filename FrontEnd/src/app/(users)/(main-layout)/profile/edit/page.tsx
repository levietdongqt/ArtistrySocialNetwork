'use client'
import { AnimatePresence } from 'framer-motion';

import {UserLayout} from "../../../_components/layout/common-layout";
import {UserDataLayout} from "../../../_components/layout/user-data-layout";
import {UserHomeLayout} from "../../../_components/layout/user-home-layout";
import {SEO} from "../../../_components/common/seo";
import {Loading} from "@components/ui/loading";
import {UserEditProfile} from "../../../_components/user/user-edit-profile";

export default function UserMedia(): JSX.Element {
  /*const { user } = useUser();*/

  /*const { id, name, username } = user ?? {};*/

  /*const { data, loading } = useCollection(
    query(
      tweetsCollection,
      where('createdBy', '==', id),
      where('images', '!=', null)
    ),
    { includeUser: true, allowNull: true }
  );*/

  /*const sortedTweets = mergeData(true, data);*/
    const loading = false;
  return (
              <UserLayout>
                  <UserDataLayout>
                     <UserEditProfile/>
                  </UserDataLayout>
              </UserLayout>
  );
}
