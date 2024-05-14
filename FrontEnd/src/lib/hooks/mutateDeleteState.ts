import {atom} from 'recoil';

export const mutateDeleteCommentState = atom<((data?: any) => Promise<any>) | null>({
    key: 'mutateDeleteCommentState',
    default: null
});