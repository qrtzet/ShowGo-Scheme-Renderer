import {atomWithStorage} from 'jotai/utils';

export type Theme = 'dark' | 'light';

export const themeAtom = atomWithStorage<Theme | null>('theme', null);
