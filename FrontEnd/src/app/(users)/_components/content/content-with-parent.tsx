import { useState } from 'react';
import { Content } from './content';
import { ContentParent } from './content-parent';
import type { TweetWithUser } from '../../../../models/tweet';

type TweetWithParentProps = {
  data: TweetWithUser[];
};

export type LoadedParents = Record<'parentId' | 'childId', string>[];

export function ContentWithParent({ data }: TweetWithParentProps): JSX.Element {
  const [loadedParents, setLoadedParents] = useState<LoadedParents>([]);

  const addParentId = (parentId: string, targetChildId: string): void =>
    setLoadedParents((prevLoadedParents) =>
      prevLoadedParents.some((item) => item.parentId === parentId)
        ? prevLoadedParents
        : [...prevLoadedParents, { parentId, childId: targetChildId }]
    );

  const filteredData = data.filter(
    (child) => !loadedParents.some((parent) => parent.parentId === child.id)
  );

  return (
    <>
      {filteredData.map((tweet) => (
        <div className='[&>article:nth-child(2)]:-mt-1' key={tweet.id}>
          {tweet.parent && (
            <ContentParent
              parentId={tweet.parent.id}
              loadedParents={loadedParents}
              addParentId={addParentId}
            />
          )}
          <Content {...tweet} modal />
        </div>
      ))}
    </>
  );
}
