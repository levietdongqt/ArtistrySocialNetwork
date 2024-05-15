import {atom} from 'recoil';

export const mutateBookmarkByPostId = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateBookmarkByPostId',
    default: null
});