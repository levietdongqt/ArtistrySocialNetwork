import {atom} from 'recoil';

export const mutateFriend = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateFriend',
    default: null
});