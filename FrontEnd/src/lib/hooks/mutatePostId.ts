import {atom} from 'recoil';

export const mutatePostId = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutatePostId',
    default: null
});