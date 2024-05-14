import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { FollowButtonType } from "@models/notifications";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { isFollowing } from "services/main/clientRequest/friendsClient";
import useSWR from "swr";


type UserFollowingProps = {
  userTargetId: string;
  hovered?: boolean;
};

export function UserFollowing({
  userTargetId,
  hovered,
}: UserFollowingProps): JSX.Element | null {
  const { currentUser } = useUser();
  // const [isFollowed,setIsFollowed] = useState();
  const { data: data } = useSWR(
    hovered
      ? isFollowing({
          userId: userTargetId,
          friendId: currentUser?.id as string,
        })
      : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
    }
  );
  return (
    <p className="rounded bg-main-search-background px-1 text-xs">
      {userTargetId === currentUser?.id ? "" : data?.data.follow ? FollowButtonType.FOLLOW : FollowButtonType.UN_FOLLOW}
      {data?.data.friend ? ` | ${FollowButtonType.FRIEND}`:``}
    </p>
  );
    if (currentUser?.id === userTargetId) {
        return null;
    }
    return (
        <p className="rounded bg-main-search-background px-1 text-xs">
            {data?.data.follow ? FollowButtonType.FOLLOW : FollowButtonType.UN_FOLLOW}

            {data?.data.friend ? ` | ${FollowButtonType.FRIEND}`:``}
        </p>
    );
}
