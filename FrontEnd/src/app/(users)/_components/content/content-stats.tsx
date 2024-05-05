'use client'
import React, { useState, useEffect, useMemo } from 'react';
import cn from 'clsx';
import {ViewContentStats} from '../view/view-content-stats';
import { TweetOption } from './content-option';
import { ContentShare } from './content-share';
import {likePosts} from "../../../../services/realtime/ServerAction/PostService";
import {AnimatePresence} from "framer-motion";
import {likeComment} from "../../../../services/realtime/ServerAction/CommentService";
import {toast} from "react-toastify";
import {HeroIcon} from "@components/ui/hero-icon";
import {ToolTip} from "@components/ui/tooltip";
import {Button} from "@components/ui/button";



type PostStatsProps =  {
    commentsId?: string;
  userId: string;
  isOwner?: boolean;
  coverImage: string,
  username: string;
  avatar: string;
  icon?: string;
  bio:string;
  postId: string;
  viewTweet?: boolean;
  openModal?: () => void;
  comment?: boolean;
  verified?: boolean;
  replyTags?: boolean;
    userPostLikes?: [];
    tagUserPosts?: [];
    totalComments?: number;
    handleParentComment?: (isParent:boolean)=>void;
};

export function ContentStats({
  userId,
  isOwner,
  postId,
  userPostLikes,
  username, avatar,
 coverImage,bio,verified,
  icon,
  viewTweet,
   tagUserPosts,
   totalComments,
  openModal,
   comment,
 replyTags,
 commentsId,
                                 handleParentComment
}: PostStatsProps): JSX.Element {
    const totalLikes = userPostLikes?.map((data:any) => data?.id).length as number || 0;
    const totalTag = tagUserPosts?.length;
    const [isLiked, setIsLiked] = useState(true);
    const [countLiked, setCountLiked] = useState<number>();
    const [{ currentComment , currentTag, currentLikes }, setCurrentStats] =
        useState({
            currentComment: totalComments,
            currentLikes: totalLikes,
            currentTag: totalTag
        });
    useEffect(() => {
        const postIsLiked = userPostLikes?.map((data:any) => data.id).includes(userId) as boolean;
        setIsLiked(postIsLiked || false);
    }, [userPostLikes]);

    useEffect(() => {
        setCurrentStats({
            currentComment: totalComments,
            currentLikes: totalLikes,
            currentTag: totalTag
        });
    }, [totalComments, totalLikes, totalTag]);
    useEffect(() => {
        setCountLiked(currentLikes);

    }, []);
    const handleLikes = async (): Promise<void> => {
        if(userId !== null){
            if(!replyTags){
                try {
                    const dataLike = {
                        postId: postId,
                        byUser: {
                            id: userId,
                            fullName: username,
                            avatar: avatar,
                            coverImage: coverImage,
                            bio: bio,
                            verified: verified
                        },
                    };
                    setIsLiked(!isLiked);
                    console.log("showLike",isLiked);
                    setCountLiked(prev => (prev || 0) + (!isLiked ? 1 : -1));
                    await likePosts(dataLike)
                } catch (error) {
                    console.error('Failed to update like status:', error);
                    setIsLiked(currentIsLiked => !currentIsLiked);
                    setCountLiked((prev:any) => (isLiked ? prev + 1 : prev - 1));
                }
            }else{
                try {
                    const dataLike = {
                        commentId: commentsId,
                        byUser: {
                            id: userId,
                            fullName: username,
                            avatar: avatar,
                            coverImage: coverImage,
                            bio: bio,
                            verified: verified
                        },
                    };
                    setIsLiked(!isLiked);
                    await likeComment(dataLike)
                } catch (error) {
                    console.error('Failed to update like status:', error);
                    setIsLiked(currentIsLiked => !currentIsLiked);
                }
            }
        }else{
            toast.error("Bạn cần đăng mới like được");
        }

    };

    const commentMove = useMemo(
        () => (totalComments as number > (currentComment as number)  ? -25 : 25),
        [totalComments]
    );

    const likeMove = useMemo(
        () => (totalLikes > currentLikes ? -25 : 25),
        [totalLikes]
    );
    const tagMove = useMemo(
        () => (totalTag as number > (currentTag as number) ? -25 : 25),
        [totalTag]
    );
    // const tweetIsPosts = tagUserPosts?.includes(userId);
    const isStatsVisible = !!(totalComments || totalTag || totalLikes);
    return (
    <>
        {
         !replyTags &&  (<AnimatePresence>
                <ViewContentStats
                    likeMove={likeMove}
                    tagMove={tagMove}
                    commentMove={commentMove}
                    currentLikes={countLiked as number}
                    currentTag={currentTag as number}
                    currentComment={currentComment as number}
                    isStatsVisible={isStatsVisible}
                />
            </AnimatePresence>)
        }
      <div
        className={cn(
          'flex text-light-secondary inner:outline-none dark:text-dark-secondary max-w  border-y-2 border-gray-300 ',
            replyTags ? 'text-sm border-y-0 ' :  'justify-between'

        )}
      >
        { comment ? null : <TweetOption
                className='hover:text-accent-blue focus-visible:text-accent-blue'
                iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20
                       group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
                tip='Comments'
                name={'Bình luận'}
                iconName='ChatBubbleOvalLeftIcon'
                viewTweet={viewTweet}
                onClick={openModal}
            />
        }
        <TweetOption
          className={cn(
            'hover:text-accent-pink focus-visible:text-accent-pink',
              isLiked ? 'text-accent-pink [&>i>svg]:fill-accent-pink' : ''
          )}
          iconClassName='group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20
                         group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80'
          tip={isLiked ? 'Unlike' : 'Like'}
          name={'Thích'}
          iconName='HeartIcon'
          viewTweet={viewTweet}
          onClick={() => handleLikes()}
        />
          {
            !replyTags &&  (<ContentShare userId={userId} postId={postId} viewTweet={viewTweet}  name={'Chia sẻ'}/>)
          }
          {
              replyTags && (
                  <Button onClick={() => handleParentComment ? handleParentComment(true) : null} className={cn(`group ml-3 flex items-center gap-1.5 p-0 transition-none 
                        disabled:cursor-not-allowed inner:transition inner:duration-200`)}>
                      <i className={'relative rounded-full p-1 not-italic group-focus-visible:ring-2'}>
                          <HeroIcon iconName={'ChatBubbleLeftRightIcon'} className={'h-5 w-5'} />
                          <ToolTip tip={'Phản hồi'} />
                      </i>
                      <p>Phản hồi</p>
                  </Button>
              )
          }
      </div>
    </>
  );
}
