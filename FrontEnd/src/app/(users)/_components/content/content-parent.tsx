import { useMemo, useEffect } from 'react';
import { getRandomId } from '@lib/random';
import { Content } from './content';
import type { LoadedParents } from './content-with-parent';

type TweetParentProps = {
  parentId: string;
  loadedParents: LoadedParents;
  addParentId: (parentId: string, componentId: string) => void;
};

export function ContentParent({
  parentId,
  loadedParents,
  addParentId
}: TweetParentProps): JSX.Element | null {
  const componentId = useMemo(getRandomId, []);

  const isParentAlreadyLoaded = loadedParents.some(
    (child) => child.childId === componentId
  );

  /*const { data, loading } = useDocument(doc(tweetsCollection, parentId), {
    includeUser: true,
    allowNull: true,
    disabled: isParentAlreadyLoaded
  });*/
  const loading = false;

  useEffect(() => {
    addParentId(parentId, componentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !isParentAlreadyLoaded /*|| !data*/) return null;

  return <Content parentTweet />;
}
