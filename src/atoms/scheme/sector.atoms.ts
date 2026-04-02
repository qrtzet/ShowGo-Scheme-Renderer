import {Sector} from '@atoms/session';
import {atom} from 'jotai';

export const isTemplateModalOpenAtom = atom(false);

export const selectedSectorAtom = atom<null | Sector>(null);
