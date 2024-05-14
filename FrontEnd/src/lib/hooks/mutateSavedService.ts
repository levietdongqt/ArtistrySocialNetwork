import {atom} from 'recoil';

export const mutateSavedService = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateSavedService',
    default: null
});