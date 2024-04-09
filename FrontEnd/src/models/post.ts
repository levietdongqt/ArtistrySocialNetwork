import type { ImagesPreview } from './file';
import type { User } from './user';
import {Timestamp} from "firebase/firestore";

export type Post = {
  id: string;
  user: User  ;
  content: string | null;
  images: ImagesPreview | null;
  parent: { id: string; username: string } | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string | null;
  status: boolean;
  tagUserPosts: [];
  userPostLikes: [];
  priorityScore: number;
  userReplies: number;
  totalLikes: number;
  totalComments: number;
};

export type TweetWithUser = Post & { user: User };
