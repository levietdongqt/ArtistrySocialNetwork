import {atom} from 'recoil';

export const mutateFriendRequest = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateFriendRequest',
    default: null
});