import {atom} from 'recoil';

export const mutateBookmark = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateBookmark',
    default: null
});