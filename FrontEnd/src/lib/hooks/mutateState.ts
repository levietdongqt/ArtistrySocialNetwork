import {atom} from 'recoil';

export const mutateState = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateState',
    default: null
});