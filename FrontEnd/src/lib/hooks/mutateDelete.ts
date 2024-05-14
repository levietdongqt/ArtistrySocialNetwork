import {atom} from 'recoil';

export const mutateDeleteComment = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateDeleteComment',
    default: null
});