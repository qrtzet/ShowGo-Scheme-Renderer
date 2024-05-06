import {atomWithStorage} from 'jotai/utils';

export type URLs = {
  apiURL: string;
  websiteURL: string;
  countryCode: 'KG' | 'UZ';
  lang: string;
};

export const urlsAtom = atomWithStorage<URLs | null>('urls', null);
