import {atom} from 'recoil';

export const mutateProfilePost = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateProfilePost',
    default: null
});